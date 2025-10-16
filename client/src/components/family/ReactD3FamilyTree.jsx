import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Tree from 'react-d3-tree';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { getProfileImageUrl } from '../../utils/profileImages';
import FamilyTreePDFExport from './FamilyTreePDFExport';

// --- Build hierarchy: supports two input shapes ---
// 1) Array of members (flat) + rootSerNo
// 2) Root object from /tree-new (already nested with children + spouse)
function buildCoupleHierarchy(source, maybeRootSerNo) {
  // Helper formatters
  const toDisplayName = (m) => (
    m?.fullName || [m?.firstName, m?.middleName, m?.lastName].filter(Boolean).join(' ').trim() || 'Unknown'
  );
  const toPhoto = (m) => {
    return getProfileImageUrl(m?.profileImage, m?.gender) || '';
  };

  // Path A: already-nested root object (tree-new response)
  if (source && typeof source === 'object' && !Array.isArray(source) && source.serNo) {
    const buildFromRoot = (member) => {
      const spouse = member?.spouse || null;
      const children = Array.isArray(member?.children) ? member.children : [];

      return {
        name: toDisplayName(member),
        attributes: {
          serNo: member.serNo,
          gender: member.gender,
          photo: toPhoto(member),
          vansh: member.vansh,
        },
        nodeType: spouse ? 'couple' : 'single',
        spouse: spouse
          ? {
              name: toDisplayName(spouse),
              attributes: {
                serNo: spouse.serNo,
                gender: spouse.gender,
                photo: toPhoto(spouse),
                vansh: spouse.vansh,
              },
            }
          : null,
        children: children.map(buildFromRoot),
      };
    };

    return buildFromRoot(source);
  }

  // Path B: flat members array + root serNo
  const members = Array.isArray(source) ? source : [];
  const rootSerNo = maybeRootSerNo;
  const visited = new Set();
  const memberMap = new Map(members.map((m) => [m.serNo, m]));

  const isSibling = (a, b) => {
    if (!a || !b) return false;
    const sameFather = a.fatherSerNo && a.fatherSerNo === b.fatherSerNo;
    const sameMother = a.motherSerNo && a.motherSerNo === b.motherSerNo;
    return !!(sameFather || sameMother);
  };

  function buildFromFlat(serNo) {
    if (!serNo || visited.has(serNo)) return null;
    visited.add(serNo);
    const member = memberMap.get(serNo);
    if (!member) return null;

    let spouse = null;
    if (member.spouseSerNo) {
      const spouseCandidate = memberMap.get(member.spouseSerNo);
      // Defensive checks: avoid pairing siblings or the known bad 19↔20
      const isBadPair = (member.serNo === 19 && spouseCandidate?.serNo === 20) || (member.serNo === 20 && spouseCandidate?.serNo === 19);
      if (spouseCandidate && !isSibling(member, spouseCandidate) && !isBadPair) {
        spouse = spouseCandidate;
        visited.add(spouse.serNo);
      }
    }

    const childSet = new Set();
    if (Array.isArray(member.childrenSerNos)) member.childrenSerNos.forEach((n) => childSet.add(n));
    if (spouse && Array.isArray(spouse.childrenSerNos)) spouse.childrenSerNos.forEach((n) => childSet.add(n));
    const childSerNos = Array.from(childSet).filter((n) => typeof n === 'number');

    const children = childSerNos
      .sort((a, b) => a - b)
      .map((cSerNo) => buildFromFlat(cSerNo))
      .filter(Boolean);

    return {
      name: toDisplayName(member),
      attributes: {
        serNo: member.serNo,
        gender: member.gender,
        photo: toPhoto(member),
        vansh: member.vansh,
      },
      nodeType: spouse ? 'couple' : 'single',
      spouse: spouse
        ? {
            name: toDisplayName(spouse),
            attributes: {
              serNo: spouse.serNo,
              gender: spouse.gender,
              photo: toPhoto(spouse),
              vansh: spouse.vansh,
            },
          }
        : null,
      children,
    };
  }

  return buildFromFlat(rootSerNo);
}
  
// --- UI constants ---
const NODE_CARD_WIDTH = 800; // total width for couple node
const NODE_CARD_HEIGHT = 250;
const COUPLE_GAP = 20;

function PersonCard({ name, photo, gender, serNo, vansh, onClick, hasChildren, isExpanded, onToggleExpand }) {
	  const isMale = gender === 'Male';
	  const cardColor = isMale ? '#91d5ff' : '#ffadd2';
	  const bgColor = isMale ? '#e6f7ff' : '#fff0f6';
  return (
    <div
      className="person-card"
      style={{
        width: NODE_CARD_WIDTH / 2 - COUPLE_GAP / 2,
        height: NODE_CARD_HEIGHT,
        background: `linear-gradient(135deg, ${bgColor} 0%, #ffffff 100%)`,
        border: `2px ${hasChildren && !isExpanded ? 'dashed' : 'solid'} ${cardColor}`,
        borderRadius: 16,
        boxShadow: '0 8px 25px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        padding: 12,
        gap: 12,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        opacity: hasChildren && !isExpanded ? 0.8 : 1,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.12)';
        e.currentTarget.style.borderColor = cardColor;
        e.currentTarget.style.filter = 'brightness(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = cardColor;
        e.currentTarget.style.filter = 'brightness(1)';
      }}
    >
      {/* Expand/Collapse Button */}
      {hasChildren && (
        <button
          onClick={onToggleExpand}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: isExpanded ? '#dc2626' : '#16a34a', // Red for collapse, green for expand
            color: 'white',
            border: '2px solid white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: 10,
            boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.15)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
            e.target.style.filter = 'brightness(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 3px 6px rgba(0,0,0,0.3)';
            e.target.style.filter = 'brightness(1)';
          }}
          title={isExpanded ? 'Collapse children' : 'Expand children'}
        >
          {isExpanded ? '−' : '+'}
        </button>
      )}

      {/* Decorative gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, ${cardColor}20 0%, transparent 70%)`,
          borderRadius: '0 16px 0 50px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: photo ? `url(${photo})` : `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flex: '0 0 auto',
          border: `3px solid #ffffff`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          color: '#ffffff',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
        }}
      >
        {!photo && name.charAt(0).toUpperCase()}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 20,
            color: '#1f2937',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            maxWidth: NODE_CARD_WIDTH / 2 - 100 - 36,
            marginBottom: '4px',
          }}
        >
          {name}
        </div>

        <div style={{
          fontSize: 14,
          color: '#6b7280',
          fontWeight: 500,
          marginBottom: '2px'
        }}>
          #{serNo}
          {vansh && <span style={{ marginLeft: '6px', color: cardColor }}>•</span>}
          {vansh && <span style={{ marginLeft: '2px', color: cardColor, fontWeight: 600 }}>{vansh}</span>}
        </div>

        <div style={{
          fontSize: 14,
          color: '#374151',
          fontWeight: 600,
          backgroundColor: `${cardColor}25`,
          padding: '2px 8px',
          borderRadius: '12px',
          display: 'inline-block',
          width: 'fit-content',
          border: `1px solid ${cardColor}40`
        }}>
          {gender || 'Unknown'}
        </div>
      </div>
    </div>
  );
}

function CoupleNode({ nodeDatum, onNodeClick, onToggleExpand, expandedNodes }) {
  const hasChildren = (nodeDatum.children && nodeDatum.children.length > 0) ||
                     (nodeDatum._collapsed) ||
                     (nodeDatum.nodeType === 'couple' && nodeDatum.spouse?.children && nodeDatum.spouse.children.length > 0);
  const isExpanded = expandedNodes.has(nodeDatum.attributes?.serNo);

  if (nodeDatum.nodeType !== 'couple') {
    return (
        <PersonCard
          name={nodeDatum.name}
          photo={nodeDatum.attributes?.photo}
          gender={nodeDatum.attributes?.gender}
          serNo={nodeDatum.attributes?.serNo}
          vansh={nodeDatum.attributes?.vansh}
          onClick={() => onNodeClick(nodeDatum.attributes?.serNo)}
          hasChildren={hasChildren}
          isExpanded={isExpanded}
          onToggleExpand={(e) => onToggleExpand(nodeDatum.attributes?.serNo, e)}
        />
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <PersonCard
          name={nodeDatum.name}
          photo={nodeDatum.attributes?.photo}
          gender={nodeDatum.attributes?.gender}
          serNo={nodeDatum.attributes?.serNo}
          vansh={nodeDatum.attributes?.vansh}
          onClick={() => onNodeClick(nodeDatum.attributes?.serNo)}
          hasChildren={hasChildren}
          isExpanded={isExpanded}
          onToggleExpand={(e) => onToggleExpand(nodeDatum.attributes?.serNo, e)}
        />
      <div style={{
        width: COUPLE_GAP,
        height: 3,
        background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
        margin: '0 6px',
        borderRadius: '2px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          animation: 'shine 2s ease-in-out infinite',
        }} />
      </div>
      {nodeDatum.spouse ? (
          <PersonCard
            name={nodeDatum.spouse?.name}
            photo={nodeDatum.spouse?.attributes?.photo}
            gender={nodeDatum.spouse?.attributes?.gender}
            serNo={nodeDatum.spouse?.attributes?.serNo}
            vansh={nodeDatum.spouse?.attributes?.vansh}
            onClick={() => onNodeClick(nodeDatum.spouse?.attributes?.serNo)}
            hasChildren={false} // Spouse doesn't have children in this structure
            isExpanded={false}
            onToggleExpand={() => {}} // No-op for spouse
          />
      ) : (
        <div style={{ width: NODE_CARD_WIDTH / 2 - COUPLE_GAP / 2, height: NODE_CARD_HEIGHT }} />
      )}
    </div>
  );
}

const containerStyles = {
  width: '100%',
  height: '80vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #ffffff 100%)',
  border: '2px solid #e2e8f0',
  borderRadius: 24,
  boxShadow: '0 12px 50px rgba(0,0,0,0.1), 0 6px 25px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
  position: 'relative',
  backdropFilter: 'blur(10px)',
  overflow: 'hidden',
};

export default function ReactD3FamilyTree() {
  const { serNo } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [expandedNodes, setExpandedNodes] = useState(new Set()); // Track expanded nodes by serNo
  const containerRef = useRef(null);


  const handleNodeClick = (serNo) => {
    if (serNo) {
      navigate(`/family/member/${serNo}`);
    }
  };

  // Handle expand/collapse toggle
  const handleToggleExpand = (serNo, e) => {
    e.stopPropagation(); // Prevent triggering node click
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serNo)) {
        newSet.delete(serNo);
      } else {
        newSet.add(serNo);
      }
      return newSet;
    });
  };

  // Function to filter tree data based on expanded nodes
  const filterTreeData = useCallback((node) => {
    if (!node) return null;

    const isExpanded = expandedNodes.has(node.attributes?.serNo);

    return {
      ...node,
      children: isExpanded && node.children ? node.children.map(filterTreeData).filter(Boolean) : [],
      _collapsed: !isExpanded && node.children && node.children.length > 0
    };
  }, [expandedNodes]);

  useEffect(() => {
    async function load() {
      try {
        const rootSerNo = Number.parseInt(serNo || '1', 10) || 1;
        const res = await api.get(`/api/family/tree-couples/${rootSerNo}?depth=8`);
        const tree = buildCoupleHierarchy(res.data);
        setData(tree);

        // Initialize all nodes with children as expanded
        const initialExpanded = new Set();
        const collectExpandableNodes = (node) => {
          const hasChildren = (node.children && node.children.length > 0) ||
                             (node.nodeType === 'couple' && node.spouse?.children && node.spouse.children.length > 0);
          if (hasChildren) {
            initialExpanded.add(node.attributes?.serNo);
            if (node.children) {
              node.children.forEach(collectExpandableNodes);
            }
          }
        };
        if (tree) {
          collectExpandableNodes(tree);
        }
        setExpandedNodes(initialExpanded);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load tree');
      }
    }
    load();
  }, [serNo]);

  // Center root on mount
  useEffect(() => {
    if (!containerRef.current) return;
    const { width } = containerRef.current.getBoundingClientRect();
    setTranslate({ x: width / 2, y: 100 });
  }, [containerRef.current]);

  const renderFoNode = useCallback((rd3tProps) => {
    const { nodeDatum } = rd3tProps;
    return (
      <foreignObject
        width={NODE_CARD_WIDTH}
        height={NODE_CARD_HEIGHT}
        x={-NODE_CARD_WIDTH / 2}
        y={-NODE_CARD_HEIGHT / 2}
      >
        <div xmlns="http://www.w3.org/1999/xhtml">
          <CoupleNode
            nodeDatum={nodeDatum}
            onNodeClick={handleNodeClick}
            onToggleExpand={handleToggleExpand}
            expandedNodes={expandedNodes}
          />
        </div>
      </foreignObject>
    );
  }, [handleNodeClick, handleToggleExpand, expandedNodes]);

  // Enhanced curved connectors with gradient and animation effects
  const pathFunc = useCallback((linkData, orientation) => {
    const { source, target } = linkData;
    // Create a more elegant S-curve for better visual flow
    const midY = (source.y + target.y) / 2;
    const curveOffset = Math.abs(target.x - source.x) * 0.3;

    // Control points for smooth S-curve
    const c1x = source.x + curveOffset;
    const c1y = source.y + (midY - source.y) * 0.3;
    const c2x = target.x - curveOffset;
    const c2y = target.y - (target.y - midY) * 0.3;

    return `M${source.x},${source.y} C ${c1x},${c1y} ${c2x},${c2y} ${target.x},${target.y}`;
  }, []);

  const treeData = useMemo(() => (data ? [filterTreeData(data)] : []), [data, filterTreeData]);

  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!data || treeData.length === 0) return <div className="text-center py-10">Loading family tree...</div>;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Family Tree Container */}
      <div ref={containerRef} style={containerStyles}>
        <Tree
          data={treeData}
          translate={translate}
          zoom={0.9}
          scaleExtent={{ min: 0.4, max: 3.2 }}
          zoomable
          separation={{ siblings: 2.4, nonSiblings: 5.6 }}
          nodeSize={{ x: NODE_CARD_WIDTH + 120, y: NODE_CARD_HEIGHT + 140 }}
          renderCustomNodeElement={renderFoNode}
          allowForeignObjects
          orientation="vertical"
          pathFunc={pathFunc}
          styles={{
            links: {
              stroke: 'url(#linkGradient)',
              strokeWidth: 4,
              fill: 'none',
              filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.15)) drop-shadow(0 1px 3px rgba(139, 92, 246, 0.3))',
            },
            nodes: {
              node: { circle: { stroke: '#9ca3af', strokeWidth: 0 } },
              leafNode: { circle: { stroke: '#9ca3af', strokeWidth: 0 } },
            },
          }}
        >
          <defs>
            <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#7c3aed" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="75%" stopColor="#d946ef" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
            </linearGradient>

            {/* Animated pulse effect for links */}
            <style>
              {`
                @keyframes linkPulse {
                  0%, 100% { stroke-opacity: 0.8; }
                  50% { stroke-opacity: 1; }
                }
                @keyframes shine {
                  0% { left: -100%; }
                  100% { left: 100%; }
                }
                path.link {
                  animation: linkPulse 3s ease-in-out infinite;
                }
              `}
            </style>
          </defs>
        </Tree>
      </div>

      {/* PDF Export button positioned below the tree */}
      {data && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '20px 20px 0 20px',
          marginTop: '10px'
        }}>
          <FamilyTreePDFExport
            treeData={data}
            viewType="reactd3"
            rootMemberName={data?.name}
          />
        </div>
      )}
    </div>
  );
}
