import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import FamilyMemberCard from '../components/family/FamilyMemberCard';
import {
  ArrowLeft,
  Users,
  UserCircle,
  GitBranch,
  Download,
  Search,
  Sparkles,
  GitMerge,
  ListFilter,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
  Calendar,
  IdCard
} from 'lucide-react';
import { exportMemberDetailsToPDF } from '../utils/pdfExport';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const SectionCard = ({ title, icon, count, actions, children }) => (
  <div className="bg-white rounded-2xl shadow-md border border-gray-200">
    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10 rounded-t-2xl">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
        {typeof count === 'number' && (
          <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            {count}
          </span>
        )}
      </div>
      {actions}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Badge = ({ children, color = 'blue' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-200`}>{children}</span>
);

const FamilyMemberPage = () => {
  const [member, setMember] = useState(null);
  const [parents, setParents] = useState({ father: null, mother: null });
  const [children, setChildren] = useState([]);
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelations, setLoadingRelations] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [relationQuery, setRelationQuery] = useState('');
  const [groupByRelation, setGroupByRelation] = useState(true);
  const { serNo } = useParams();
  const { addToast } = useToast();

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        if (!serNo || serNo === 'undefined' || isNaN(parseInt(serNo))) {
          throw new Error(`Invalid serNo parameter: ${serNo}`);
        }

        const memberRes = await api.get(`/api/family/member-new/${serNo}`);
        setMember(memberRes.data);

        const parentsRes = await api.get(`/api/family/member-new/${serNo}/parents`);
        setParents(parentsRes.data);

        const childrenRes = await api.get(`/api/family/member-new/${serNo}/children`);
        setChildren(childrenRes.data);

        try {
          setLoadingRelations(true);
          const relationsRes = await api.get(`/api/family/dynamic-relations/${serNo}`);
          setRelations(relationsRes.data || []);
        } catch (e) {
          console.error('Failed to fetch dynamic relations (relationRules based):', e?.response?.data || e.message);
          setRelations([]);
        } finally {
          setLoadingRelations(false);
        }

        setTimeout(() => setLoading(false), 300);
      } catch (err) {
        console.error('Error fetching family member data:', err);
        setTimeout(() => {
          setError('Failed to load family member data. Please try again later.');
          setLoading(false);
          setLoadingRelations(false);
        }, 300);
      }
    };

    fetchMemberData();
  }, [serNo]);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const timestamp = new Date().toISOString().slice(0, 10);
      const memberName = member.fullName || `${member.firstName || ''} ${member.lastName || ''}`.trim();
      const filename = `family-member-${memberName.replace(/\s+/g, '-')}-${timestamp}.pdf`;
      await exportMemberDetailsToPDF(member, filename);
      addToast('PDF exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast('Failed to export PDF. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const filteredRelations = useMemo(() => {
    const q = relationQuery.trim().toLowerCase();
    const list = !q
      ? relations
      : relations.filter((r) => {
          const label = `${r.relationEnglish || ''} ${r.relationMarathi || ''}`.toLowerCase();
          const name = [r.related?.firstName, r.related?.middleName, r.related?.lastName]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          const ser = String(r.related?.serNo || '').toLowerCase();
          return label.includes(q) || name.includes(q) || ser.includes(q);
        });

    if (!groupByRelation) return list;

    // Group by relationEnglish label
    const groups = list.reduce((acc, r) => {
      const key = r.relationEnglish || 'Other';
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    }, {});

    // Convert to array of sections
    return Object.entries(groups)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, items]) => ({ key, items }));
  }, [relations, relationQuery, groupByRelation]);

  // Prefer dynamic relations to derive accurate parents and children
  const derivedParents = useMemo(() => {
    const fatherRel = relations.find((r) => r.relationEnglish === 'Father');
    const motherRel = relations.find((r) => r.relationEnglish === 'Mother');
    return {
      father: fatherRel?.related || parents.father || (member?.fatherSerNo ? { serNo: member.fatherSerNo, fullName: undefined } : null),
      mother: motherRel?.related || parents.mother || (member?.motherSerNo ? { serNo: member.motherSerNo, fullName: undefined } : null),
    };
  }, [relations, parents, member]);

  const derivedChildren = useMemo(() => {
    const relChildren = relations
      .filter((r) => r.relationEnglish === 'Son' || r.relationEnglish === 'Daughter')
      .map((r) => r.related)
      .filter(Boolean);
    if (relChildren.length > 0) return relChildren;
    if (Array.isArray(children) && children.length > 0) return children;
    return [];
  }, [relations, children]);

  if (loading) return <div className="text-center py-10">Loading member details...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!member) return <div className="text-center py-10">Member not found.</div>;

  const memberName = member.fullName || `${member.firstName || ''} ${member.lastName || ''}`.trim();
  const chips = [
    member.gender,
    member.vansh ? `Vansh: ${member.vansh}` : null,
    member.bloodGroup ? `Blood: ${member.bloodGroup}` : null,
    member.isAlive === false ? 'Deceased' : null
  ].filter(Boolean);
  const fullAddress = [
    member.addressLine1,
    member.addressLine2,
    member.city || member.currentCity,
    member.state,
    member.postalCode,
    member.country
  ].filter(Boolean).join(', ');

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/95 to-teal-500/90" />
        <div className="relative p-6 sm:p-8 text-white rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-medium mb-2">
                <Sparkles size={14} className="mr-1" />
                Family Member
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {memberName || 'Member'}
                <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">#{member.serNo}</span>
              </h1>
              <p className="text-blue-50/90 text-sm sm:text-base mt-1">Detailed profile, immediate relations, and extended connections</p>
              {chips.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {chips.map((c, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/15 text-white border border-white/20">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/family" className="inline-flex items-center px-4 py-2 rounded-lg bg-white/15 text-white hover:bg-white/20 transition-colors">
                <ArrowLeft size={18} className="mr-2" /> Back to Family List
              </Link>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-colors disabled:opacity-60"
              >
                <Download size={18} className="mr-2" /> {isExporting ? 'Exporting…' : 'Export PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Member core info */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Profile" icon={<UserCircle className="h-5 w-5 text-blue-600" />}> 
            <FamilyMemberCard member={member} />

            {(member.Bio || member.occupation || member.dob || member.dod || member.maritalInfo || member.vansh || member.bloodGroup) && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Additional Information</h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {member.dob && (
                    <div>
                      <p className="text-gray-500">Date of Birth</p>
                      <p className="font-medium">{formatDate(member.dob)}</p>
                    </div>
                  )}
                  {member.dod && (
                    <div>
                      <p className="text-gray-500">Date of Death</p>
                      <p className="font-medium">{formatDate(member.dod)}</p>
                    </div>
                  )}
                  {member.vansh && (
                    <div>
                      <p className="text-gray-500">Vansh</p>
                      <p className="font-medium">{member.vansh}</p>
                    </div>
                  )}
                  {member.occupation && (
                    <div>
                      <p className="text-gray-500">Occupation</p>
                      <p className="font-medium">{member.occupation}</p>
                    </div>
                  )}
                  {member.isAlive !== undefined && (
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium">{member.isAlive ? 'Alive' : 'Deceased'}</p>
                    </div>
                  )}
                  {member.bloodGroup && (
                    <div>
                      <p className="text-gray-500">Blood Group</p>
                      <p className="font-medium">{member.bloodGroup}</p>
                    </div>
                  )}
                </div>
                {member.maritalInfo && (member.maritalInfo.married || member.maritalInfo.marriageDate) && (
                  <div className="mt-3">
                    <p className="text-gray-500 mb-2">Marital Information</p>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      {member.maritalInfo.married && (
                        <div>
                          <p className="text-gray-500">Married</p>
                          <p className="font-medium">Yes</p>
                        </div>
                      )}
                      {member.maritalInfo.marriageDate && (
                        <div>
                          <p className="text-gray-500">Marriage Date</p>
                          <p className="font-medium">{member.maritalInfo.marriageDate}</p>
                        </div>
                      )}
                      {member.maritalInfo.divorced && (
                        <div>
                          <p className="text-gray-500">Divorced</p>
                          <p className="font-medium">Yes</p>
                        </div>
                      )}
                      {member.maritalInfo.widowed && (
                        <div>
                          <p className="text-gray-500">Widowed</p>
                          <p className="font-medium">Yes</p>
                        </div>
                      )}
                      {member.maritalInfo.remarried && (
                        <div>
                          <p className="text-gray-500">Remarried</p>
                          <p className="font-medium">Yes</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {member.Bio && (
                  <div className="mt-3">
                    <p className="text-gray-500 mb-1">Biography</p>
                    <p className="text-gray-800 leading-relaxed">{member.Bio}</p>
                  </div>
                )}
              </div>
            )}
          </SectionCard>

          {/* Contact & Address */}
          {(member.phone || member.email || fullAddress) && (
            <SectionCard title="Contact & Address" icon={<IdCard className="h-5 w-5 text-indigo-600" />}> 
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {member.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">{member.phone}</p>
                    </div>
                  </div>
                )}
                {member.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium break-all">{member.email}</p>
                    </div>
                  </div>
                )}
                {fullAddress && (
                  <div className="sm:col-span-2 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Address</p>
                      <p className="font-medium text-gray-800">{fullAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Education & Occupation */}
          {(member.education || member.occupation || member.company) && (
            <SectionCard title="Education & Occupation" icon={<Briefcase className="h-5 w-5 text-amber-600" />}> 
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {member.education && (
                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Education</p>
                      <p className="font-medium">{member.education}</p>
                    </div>
                  </div>
                )}
                {member.occupation && (
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Occupation</p>
                      <p className="font-medium">{member.occupation}</p>
                    </div>
                  </div>
                )}
                {member.company && (
                  <div className="flex items-start gap-2">
                    <IdCard className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Company</p>
                      <p className="font-medium">{member.company}</p>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Relations */}
          <SectionCard
            title="Relations"
            icon={<GitMerge className="h-5 w-5 text-green-600" />}
            count={relations.length}
            actions={
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 text-gray-400 absolute left-2 top-2.5" />
                  <input
                    type="text"
                    value={relationQuery}
                    onChange={(e) => setRelationQuery(e.target.value)}
                    placeholder="Search by relation, name, or #serNo"
                    className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
                <button
                  onClick={() => setGroupByRelation((v) => !v)}
                  className="inline-flex items-center text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <ListFilter className="h-4 w-4 mr-1" /> {groupByRelation ? 'Ungroup' : 'Group by relation'}
                </button>
              </div>
            }
          >
            {loadingRelations ? (
              <p className="text-gray-500 text-sm">Loading relations…</p>
            ) : relations.length === 0 ? (
              <p className="text-gray-500 text-sm">No relations found</p>
            ) : groupByRelation ? (
              <div className="space-y-4 max-h-[28rem] overflow-y-auto">
                {filteredRelations.map((section) => (
                  <div key={section.key} className="">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge color="green">{section.key}</Badge>
                        <span className="text-xs text-gray-500">{section.items.length}</span>
                      </div>
                    </div>
                    <div className="divide-y">
                      {section.items.map((r, idx) => {
                        const name = [r.related?.firstName, r.related?.middleName, r.related?.lastName].filter(Boolean).join(' ');
                        const label = r.relationMarathi ? `${r.relationEnglish} [${r.relationMarathi}]` : r.relationEnglish;
                        const initials = (name || '?')
                          .split(' ')
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase();
                        return (
                          <Link
                            key={`${section.key}-${r.related?.serNo}-${idx}`}
                            to={`/family/member/${r.related?.serNo}`}
                            className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-semibold border border-green-200">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm text-gray-900 truncate">
                                  <span className="font-medium">{label}</span>
                                  <span className="text-gray-500"> → </span>
                                  <span className="truncate inline-block max-w-[14rem] align-bottom">{name}</span>
                                </div>
                                <div className="text-xs text-gray-400">#{r.related?.serNo}</div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-h-[28rem] overflow-y-auto divide-y">
                {filteredRelations.map((r, idx) => {
                  const name = [r.related?.firstName, r.related?.middleName, r.related?.lastName].filter(Boolean).join(' ');
                  const label = r.relationMarathi ? `${r.relationEnglish} [${r.relationMarathi}]` : r.relationEnglish;
                  const initials = (name || '?')
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();
                  return (
                    <Link
                      key={`${r.relationEnglish}-${r.related?.serNo}-${idx}`}
                      to={`/family/member/${r.related?.serNo}`}
                      className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-semibold border border-green-200">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-gray-900 truncate">
                            <span className="font-medium">{label}</span>
                            <span className="text-gray-500"> → </span>
                            <span className="truncate inline-block max-w-[14rem] align-bottom">{name}</span>
                          </div>
                          <div className="text-xs text-gray-400">#{r.related?.serNo}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right: Parents / Children / Actions */}
        <div className="space-y-6">
          {/* Parents */}
          <SectionCard
            title="Parents"
            icon={<UserCircle className="h-5 w-5 text-blue-600" />}
            count={(derivedParents.father ? 1 : 0) + (derivedParents.mother ? 1 : 0)}
          >
            {derivedParents.father || derivedParents.mother ? (
              <div className="space-y-3">
                {derivedParents.father && (
                  <Link to={`/family/member/${derivedParents.father.serNo}`} className="block p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{derivedParents.father.fullName || `${derivedParents.father.firstName || ''} ${derivedParents.father.lastName || ''}`.trim() || `Father`}</p>
                        <p className="text-xs text-gray-500">Father • #{derivedParents.father.serNo}</p>
                      </div>
                      <Badge>Father</Badge>
                    </div>
                  </Link>
                )}
                {derivedParents.mother && (
                  <Link to={`/family/member/${derivedParents.mother.serNo}`} className="block p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{derivedParents.mother.fullName || `${derivedParents.mother.firstName || ''} ${derivedParents.mother.lastName || ''}`.trim() || `Mother`}</p>
                        <p className="text-xs text-gray-500">Mother • #{derivedParents.mother.serNo}</p>
                      </div>
                      <Badge color="indigo">Mother</Badge>
                    </div>
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No parent information available</p>
            )}
          </SectionCard>

          {/* Children */}
          <SectionCard title="Children" icon={<Users className="h-5 w-5 text-blue-600" />} count={derivedChildren.length}>
            {derivedChildren.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                {derivedChildren.map((child) => (
                  <Link
                    key={child.serNo}
                    to={`/family/member/${child.serNo}`}
                    className="block p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{child.fullName || `${child.firstName || ''} ${child.lastName || ''}`.trim()}</p>
                        <div className="flex gap-3 text-xs text-gray-500">
                          <span>{child.gender}</span>
                          <span>#{child.serNo}</span>
                        </div>
                      </div>
                      <Badge color="purple">Child</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No children</p>
            )}
          </SectionCard>

          {/* View tree */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-4 shadow-md">
            <Link
              to={`/family/tree/${member.serNo}`}
              className="block w-full bg-white text-blue-700 hover:bg-blue-50 py-2 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center"
            >
              <GitBranch className="mr-2" size={16} /> View Family Tree
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberPage;