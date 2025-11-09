import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  IdCard,
  ChevronDown
} from 'lucide-react';
import { exportMemberDetailsToPDF } from '../utils/pdfExport';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { transformMemberData, transformMembersData } from '../utils/memberTransform';
import { getProfileImageUrl, resolveProfileImage } from '../utils/profileImages';

// Tailwind-safe badge variant map (avoid dynamic string classnames)
const BADGE_COLOR = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
};

const SectionCard = ({ title, icon, count, actions, children, className = '', bodyClassName = '' }) => (
  <div className={`rounded-3xl bg-white/90 shadow-xl ring-1 ring-orange-200/60 backdrop-blur ${className}`}>
    <div className="px-6 py-4 border-b border-orange-100 flex items-center justify-between rounded-t-3xl bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center h-9 w-9 rounded-2xl bg-orange-100 text-orange-600">
          {icon}
        </span>
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
          {typeof count === 'number' && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full bg-orange-100/70 text-orange-700 border border-orange-200/70">
              {count}
            </span>
          )}
        </div>
      </div>
      {actions}
    </div>
    <div className={`p-6 sm:p-7 ${bodyClassName}`}>{children}</div>
  </div>
);

const Badge = ({ children, color = 'blue' }) => {
  const cls = BADGE_COLOR[color] || BADGE_COLOR.blue;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {children}
    </span>
  );
};

// Unified and corrected sanitizeRelationText function
const sanitizeRelationText = (text) => {
  if (typeof text !== 'string') return '';
  return text.replace(/[{}]/g, ' ').replace(/\s+/g, ' ').trim();
};

const hasProfileSource = (person) => {
  if (!person) return false;
  const candidates = [
    person.profileImage,
    person.personalDetails?.profileImage,
    person.profilePicture,
    person.profileImageData,
    person.profileImageUrl,
    person.photo,
    person.image,
    person.avatar
  ];
  return candidates.some((candidate) => {
    if (!candidate) return false;
    if (typeof candidate === 'string') {
      return candidate.trim().length > 0;
    }
    if (Array.isArray(candidate)) {
      return candidate.length > 0;
    }
    if (typeof candidate === 'object') {
      const nested = candidate.data || candidate.base64 || candidate.value || candidate.source || candidate.url || candidate.secure_url || candidate.secureUrl || candidate.Location || candidate.location || candidate.path || candidate.href || candidate.link;
      if (typeof nested === 'string') {
        return nested.trim().length > 0;
      }
      if (Array.isArray(nested)) {
        return nested.length > 0;
      }
      if (nested && typeof nested === 'object' && Array.isArray(nested.data)) {
        return nested.data.length > 0;
      }
    }
    return false;
  });
};

const FamilyMemberPage = () => {
  const [member, setMember] = useState(null);
  const [parents, setParents] = useState({ father: null, mother: null });
  const [memberChildren, setMemberChildren] = useState([]); // renamed from "children"
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelations, setLoadingRelations] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [relationQuery, setRelationQuery] = useState('');
  const [groupByRelation, setGroupByRelation] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});
  const { serNo } = useParams();
  const { addToast } = useToast();

  const ensureRelationImages = useCallback(async (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    const missingSerNos = Array.from(
      new Set(
        items
          .filter((relation) => !hasProfileSource(relation?.related))
          .map((relation) => relation?.related?.serNo)
          .filter((value) => value !== null && value !== undefined)
      )
    );

    if (missingSerNos.length === 0) {
      return items;
    }

    const fetchedEntries = await Promise.all(
      missingSerNos.map(async (value) => {
        try {
          const response = await api.get(`/api/family/member-new/${value}`);
          const data = transformMemberData(response.data);
          return data ? [data.serNo, data] : null;
        } catch (error) {
          console.error(`Failed to fetch member ${value} for relation profile image:`, error);
          return null;
        }
      })
    );

    const updates = fetchedEntries.filter(Boolean);
    if (updates.length === 0) {
      return items;
    }

    const updateMap = new Map(updates);

    return items.map((relation) => {
      const relatedSerNo = relation?.related?.serNo;
      if (relatedSerNo === null || relatedSerNo === undefined) {
        return relation;
      }
      const numericSerNo = Number(relatedSerNo);
      const enrichedMember = updateMap.get(Number.isNaN(numericSerNo) ? relatedSerNo : numericSerNo) || updateMap.get(String(relatedSerNo));
      if (!enrichedMember) {
        return relation;
      }
      return {
        ...relation,
        related: {
          ...relation.related,
          ...enrichedMember,
          profileImage: enrichedMember.profileImage ?? relation.related?.profileImage,
          profileImageData: enrichedMember.profileImageData ?? relation.related?.profileImageData,
          profilePicture: enrichedMember.profilePicture ?? relation.related?.profilePicture,
          photo: enrichedMember.profileImage ?? relation.related?.photo,
          image: enrichedMember.profileImage ?? relation.related?.image,
          avatar: enrichedMember.profileImage ?? relation.related?.avatar,
        }
      };
    });
  }, []);

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
        setError(null);
        setLoading(true);
        setLoadingRelations(true);

        const ser = Number(serNo);
        if (!Number.isFinite(ser)) {
          throw new Error(`Invalid serNo parameter: ${serNo}`);
        }

        const [memberRes, parentsRes, childrenRes, relationsPayload] = await Promise.all([
          api.get(`/api/family/member-new/${serNo}`),
          api.get(`/api/family/member-new/${serNo}/parents`),
          api.get(`/api/family/member-new/${serNo}/children`),
          api
            .get(`/api/family/dynamic-relations/${serNo}`)
            .then((res) => res.data || [])
            .catch((e) => {
              console.error('Failed to fetch dynamic relations (relationRules based):', e?.response?.data || e.message);
              return null;
            })
        ]);

        const transformedMember = transformMemberData(memberRes.data);
        const sanitizedMember = { ...transformedMember };
        if (String(sanitizedMember.serNo) === '13') {
          delete sanitizedMember.dateOfDeath;
        }
        setMember(sanitizedMember);

        let normalizedParents = parentsRes.data;
        if (Array.isArray(parentsRes.data)) {
          const arr = transformMembersData(parentsRes.data) || [];
          const father =
            arr.find(p => p.relationEnglish === 'Father') ||
            arr.find(p => (p.gender || '').toLowerCase() === 'male') ||
            null;
          const mother =
            arr.find(p => p.relationEnglish === 'Mother') ||
            arr.find(p => (p.gender || '').toLowerCase() === 'female') ||
            null;
          normalizedParents = { father, mother };
        }
        setParents(normalizedParents);

        const transformedChildren = Array.isArray(childrenRes.data)
          ? transformMembersData(childrenRes.data)
          : childrenRes.data || [];
        setMemberChildren(Array.isArray(transformedChildren) ? transformedChildren : []);

        const relationsList = Array.isArray(relationsPayload) ? relationsPayload : [];
        const enrichedRelations = await ensureRelationImages(relationsList);
        setRelations(enrichedRelations);
      } catch (err) {
        console.error('Error fetching family member data:', err);
        setError('Failed to load family member data. Please try again later.');
        setRelations([]);
        setParents({ father: null, mother: null });
        setMemberChildren([]);
      } finally {
        setLoading(false);
        setLoadingRelations(false);
      }
    };

    fetchMemberData();
  }, [serNo, ensureRelationImages]);

  useEffect(() => {
    setExpandedGroups({});
  }, [relations, groupByRelation]);

  const handleExportPDF = async () => {
    try {
      if (!member) return;
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

  // Search + safety filter to avoid Links with undefined serNo
  const filteredRelations = useMemo(() => {
    const q = relationQuery.trim().toLowerCase();
    const base = !q
      ? relations
      : relations.filter((r) => {
          const label = `${sanitizeRelationText(r.relationEnglish) || ''} ${sanitizeRelationText(r.relationMarathi) || ''}`.toLowerCase();
          const name = [r.related?.firstName, r.related?.middleName, r.related?.lastName]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          const ser = String(r.related?.serNo || '').toLowerCase();
          return label.includes(q) || name.includes(q) || ser.includes(q);
        });

    // ensure reliable links only
    const safe = base.filter(r => r?.related?.serNo != null);

    if (!groupByRelation) return safe;
    // group by relationEnglish
    const groups = safe.reduce((acc, r) => {
      const key = sanitizeRelationText(r.relationEnglish) || 'Other';
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    }, {});

    return Object.entries(groups)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, items]) => ({ key, items }));
  }, [relations, relationQuery, groupByRelation]);

  // derived counts for the header badge
  const filteredRelationsCount = useMemo(() => {
    if (groupByRelation) {
      return Array.isArray(filteredRelations)
        ? filteredRelations.reduce((sum, s) => sum + s.items.length, 0)
        : 0;
    }
    return Array.isArray(filteredRelations) ? filteredRelations.length : 0;
  }, [filteredRelations, groupByRelation]);

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
    if (Array.isArray(memberChildren) && memberChildren.length > 0) return memberChildren;
    return [];
  }, [relations, memberChildren]);

  const derivedSpouse = useMemo(() => {
    const spouseRel = relations.find((r) => r.relationEnglish === 'Spouse' || r.relationEnglish === 'Husband' || r.relationEnglish === 'Wife');
    return spouseRel?.related || null;
  }, [relations]);

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
    member.colonyStreet || member.addressLine1,
    member.flatPlotNumber || member.addressLine2,
    member.city || member.currentCity,
    member.state,
    member.pinCode || member.postalCode,
    member.country
  ].filter(Boolean).join(', ');
  const rawBiography = member.bio || member.Bio || member.aboutYourself || '';
  const biography = typeof rawBiography === 'string' ? rawBiography.trim() : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-300 opacity-90" />
          <div className="relative p-6 sm:p-10 text-slate-900 rounded-3xl bg-white/75 backdrop-blur-xl shadow-xl border border-white/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100/70 text-orange-700 text-xs font-semibold shadow-sm">
                  <Sparkles size={14} className="mr-1" />
                  Family Member
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex flex-wrap items-center gap-3 text-slate-900">
                    {memberName || 'Member'}
                    <span className="text-xs font-semibold bg-white/80 text-orange-600 px-3 py-1 rounded-full shadow-sm border border-orange-200/80">
                      #{member.serNo}
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600/90 mt-2 max-w-xl">
                    Detailed profile, immediate relations, and extended connections within the Bal Krishna Nivas family network.
                  </p>
                </div>
                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {chips.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-orange-600 border border-orange-200 shadow-sm"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Link
                  to="/family"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-2xl bg-white text-orange-600 hover:bg-orange-50 transition-colors shadow-md border border-orange-200"
                >
                  <ArrowLeft size={18} className="mr-2" /> Back to Family List
                </Link>
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-2xl bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-60 shadow-md"
                >
                  <Download size={18} className="mr-2" /> {isExporting ? 'Exporting…' : 'Export PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-8 lg:gap-10">
          <div className="space-y-6">
            <SectionCard title="Profile" icon={<UserCircle className="h-5 w-5" />}>
              <FamilyMemberCard member={member} spouse={derivedSpouse} childrenCount={derivedChildren.length} />
              {(biography || member.aboutYourself || member.occupation || member.dateOfBirth || member.dateOfDeath || member.maritalInfo || member.vansh || member.bloodGroup) && (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {biography && (
                    <div className="rounded-2xl bg-white/80 border border-orange-100/70 p-5 shadow-sm md:col-span-2">
                      <h4 className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> Biography
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                        {biography}
                      </p>
                    </div>
                  )}
                  <div className="rounded-2xl bg-white/90 border border-orange-100 p-5 shadow-sm">
                    <h4 className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Milestones
                    </h4>
                    <div className="space-y-3 text-sm text-slate-600">
                      {member.dateOfBirth && (
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-100 text-orange-600 text-xs font-bold">DOB</span>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-orange-500">Born</p>
                            <p className="font-medium text-slate-800">{formatDate(member.dateOfBirth)}</p>
                          </div>
                        </div>
                      )}
                      {member.isAlive === false && member.dateOfDeath && (
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-100 text-rose-500 text-xs font-bold">RIP</span>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-rose-400">Passed</p>
                            <p className="font-medium text-slate-800">{formatDate(member.dateOfDeath)}</p>
                          </div>
                        </div>
                      )}
                      {member.maritalInfo?.marriageDate && (
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          <div>
                            <p className="text-xs uppercase tracking-wide text-orange-500">Marriage Date</p>
                            <p className="font-medium text-slate-800">{formatDate(member.maritalInfo.marriageDate)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/90 border border-orange-100 p-5 shadow-sm">
                    <h4 className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Profile Highlights
                    </h4>
                    <div className="grid gap-3 text-sm text-slate-600">
                      {member.vansh && (
                        <div className="flex justify-between items-center">
                          <p className="text-slate-500">Vansh</p>
                          <span className="font-medium text-slate-800">{member.vansh}</span>
                        </div>
                      )}
                      {member.occupation && (
                        <div className="flex justify-between items-center">
                          <p className="text-slate-500">Occupation</p>
                          <span className="font-medium text-slate-800">{member.occupation}</span>
                        </div>
                      )}
                      {member.profession && (
                        <div className="flex justify-between items-center">
                          <p className="text-slate-500">Profession</p>
                          <span className="font-medium text-slate-800">{member.profession}</span>
                        </div>
                      )}
                      {member.qualifications && (
                        <div className="flex justify-between items-center">
                          <p className="text-slate-500">Qualifications</p>
                          <span className="font-medium text-slate-800">{member.qualifications}</span>
                        </div>
                      )}
                      {member.isAlive !== undefined && (
                        <div className="flex justify-between items-center">
                          <p className="text-slate-500">Status</p>
                          <span className="font-medium text-slate-800">{member.isAlive ? 'Alive' : 'Deceased'}</span>
                        </div>
                      )}
                      {member.bloodGroup && (
                        <div className="flex justify-between items-center">
                          <p className="text-slate-500">Blood Group</p>
                          <span className="font-medium text-slate-800">{member.bloodGroup}</span>
                        </div>
                      )}
                      {member.maritalInfo?.married && (
                        <div className="flex justify-between items-center">
                          <p className="text-slate-500">Married</p>
                          <span className="font-medium text-slate-800">Yes</span>
                        </div>
                      )}
                      {member.maritalInfo?.divorced && (
                        <div className="flex justify-between items-center">
                          <p className="text-slate-500">Divorced</p>
                          <span className="font-medium text-slate-800">Yes</span>
                        </div>
                      )}
                      {member.maritalInfo?.widowed && (
                        <div className="flex justify-between items-center">
                          <p className="text-slate-500">Widowed</p>
                          <span className="font-medium text-slate-800">Yes</span>
                        </div>
                      )}
                      {member.maritalInfo?.remarried && (
                        <div className="flex justify-between items-center">
                          <p className="text-slate-500">Remarried</p>
                          <span className="font-medium text-slate-800">Yes</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>
            {/* Education & Occupation */}
            {(member.education || member.occupation || member.company) && (
              <SectionCard title="Education & Occupation" icon={<Briefcase className="h-5 w-5" />}>
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
          </div>
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
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-10 w-10">
                            <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                              <img
                                src={resolveProfileImage(derivedParents.father)}
                                alt={derivedParents.father.fullName || `${derivedParents.father.firstName || ''} ${derivedParents.father.lastName || ''}`.trim() || 'Father'}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const img = e.currentTarget;
                                  img.onerror = null;
                                  img.src = getProfileImageUrl(null, derivedParents.father.gender);
                                }}
                              />
                            </div>
                            {derivedParents.father.gender && (
                              <span
                                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: derivedParents.father.gender?.toLowerCase() === 'male' ? '#3b82f6' : '#ec4899' }}
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{derivedParents.father.fullName || `${derivedParents.father.firstName || ''} ${derivedParents.father.lastName || ''}`.trim() || `Father`}</p>
                            <p className="text-xs text-gray-500">Father • #{derivedParents.father.serNo}</p>
                          </div>
                        </div>
                        <Badge>Father</Badge>
                      </div>
                    </Link>
                  )}
                  {derivedParents.mother && (
                    <Link to={`/family/member/${derivedParents.mother.serNo}`} className="block p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-10 w-10">
                            <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                              <img
                                src={resolveProfileImage(derivedParents.mother)}
                                alt={derivedParents.mother.fullName || `${derivedParents.mother.firstName || ''} ${derivedParents.mother.lastName || ''}`.trim() || 'Mother'}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const img = e.currentTarget;
                                  img.onerror = null;
                                  img.src = getProfileImageUrl(null, derivedParents.mother.gender);
                                }}
                              />
                            </div>
                            {derivedParents.mother.gender && (
                              <span
                                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: derivedParents.mother.gender?.toLowerCase() === 'male' ? '#3b82f6' : '#ec4899' }}
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{derivedParents.mother.fullName || `${derivedParents.mother.firstName || ''} ${derivedParents.mother.lastName || ''}`.trim() || `Mother`}</p>
                            <p className="text-xs text-gray-500">Mother • #{derivedParents.mother.serNo}</p>
                          </div>
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
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                            <img
                              src={resolveProfileImage(child)}
                              alt={child.fullName || `${child.firstName || ''} ${child.lastName || ''}`.trim() || 'Child'}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const img = e.currentTarget;
                                img.onerror = null;
                                img.src = getProfileImageUrl(null, child.gender);
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {child.fullName || `${child.firstName || ''} ${child.lastName || ''}`.trim()}
                            </p>
                            <div className="flex gap-3 text-xs text-gray-500">
                              {child.gender && <span>{child.gender}</span>}
                              <span>#{child.serNo}</span>
                            </div>
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
            {/* Contact & Address */}
            {(member.phone || member.email || fullAddress) && (
              <SectionCard title="Contact & Address" icon={<IdCard className="h-5 w-5" />}>
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

            {/* View tree */}
            <div className="bg-white/90 border border-orange-100 rounded-2xl p-4 shadow-sm">
              <Link
                to={`/family/tree/${member.serNo}`}
                className="block w-full bg-orange-500 text-white hover:bg-orange-600 py-2.5 px-4 rounded-xl text-center font-semibold transition-colors flex items-center justify-center shadow"
              >
                <GitBranch className="mr-2" size={16} /> View Family Tree
              </Link>
            </div>
          </div>
        </div>
        {/* Relations */}
        <SectionCard
          title="Relations"
          icon={<GitMerge className="h-5 w-5" />}
          count={filteredRelationsCount}
          className="h-full lg:min-h-[34rem]"
          bodyClassName="flex flex-col"
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-2 top-2.5" />
                <input
                  type="text"
                  value={relationQuery}
                  onChange={(e) => setRelationQuery(e.target.value)}
                  placeholder="Search by relation, name, or #serNo"
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-64"
                />
              </div>
              <button
                onClick={() => setGroupByRelation((v) => !v)}
                className="inline-flex items-center text-xs px-2.5 py-1.5 border border-orange-200 rounded-lg text-orange-600 hover:bg-orange-50"
              >
                <ListFilter className="h-4 w-4 mr-1" /> {groupByRelation ? 'Ungroup' : 'Group by relation'}
              </button>
            </div>
          }
        >
          {loadingRelations ? (
            <p className="text-gray-500 text-sm">Loading relations…</p>
          ) : filteredRelationsCount === 0 ? (
            <p className="text-gray-500 text-sm">No relations found</p>
          ) : groupByRelation ? (
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {filteredRelations.map((section) => {
                const isExpanded = !!expandedGroups[section.key];
                const panelId = `relations-${section.key.replace(/\s+/g, '-').toLowerCase()}`;
                return (
                  <div key={section.key} className="rounded-xl border border-gray-200 bg-white/80">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedGroups((prev) => ({ ...prev, [section.key]: !isExpanded }))
                      }
                      className="w-full flex items-center justify-between px-4 py-3 focus:outline-none"
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                    >
                      <div className="flex items-center gap-2">
                        <Badge color="green">{section.key}</Badge>
                        <span className="text-xs text-gray-500">{section.items.length}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      id={panelId}
                      className={`divide-y border-t border-gray-200 ${isExpanded ? '' : 'hidden'}`}
                    >
                      {section.items.map((r, idx) => {
                        const name = [r.related?.firstName, r.related?.middleName, r.related?.lastName].filter(Boolean).join(' ');
                        const relationLabel = sanitizeRelationText(r.relationEnglish) || 'Relation';
                        const relationMarathi = sanitizeRelationText(r.relationMarathi);
                        const label = relationMarathi ? `${relationLabel} [${relationMarathi}]` : relationLabel;
                        const initials = (name || relationLabel || '?')
                          .split(' ')
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase();
                        const profileImage = resolveProfileImage(r.related);
                        return (
                          <Link
                            key={`${section.key}-${r.related?.serNo}-${idx}`}
                            to={`/family/member/${r.related?.serNo}`}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="h-12 w-12 rounded-full overflow-hidden border border-green-200 bg-green-50 flex-shrink-0 shadow-sm">
                                {profileImage ? (
                                  <img
                                    src={profileImage}
                                    alt={name || label}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      const img = e.currentTarget;
                                      img.onerror = null;
                                      img.src = getProfileImageUrl(null, r.related?.gender);
                                    }}
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-sm font-semibold text-green-700">
                                    {initials}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {name || label}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{label}</p>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-gray-400">#{r.related?.serNo}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y pr-1">
              {filteredRelations.map((r, idx) => {
                const name = [r.related?.firstName, r.related?.middleName, r.related?.lastName].filter(Boolean).join(' ');
                const relationLabel = sanitizeRelationText(r.relationEnglish) || 'Relation';
                const relationMarathi = sanitizeRelationText(r.relationMarathi);
                const label = relationMarathi ? `${relationLabel} [${relationMarathi}]` : relationLabel;
                const initials = (name || relationLabel || '?')
                  .split(' ')
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase();
                const profileImage = resolveProfileImage(r.related);
                return (
                  <Link
                    key={`${relationLabel}-${r.related?.serNo}-${idx}`}
                    to={`/family/member/${r.related?.serNo}`}
                    className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-green-200 bg-green-50 flex items-center justify-center text-xs font-semibold">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={name || label}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const img = e.currentTarget;
                              img.onerror = null;
                              img.src = getProfileImageUrl(null, r.related?.gender);
                            }}
                          />
                        ) : (
                          <span className="text-green-700">{initials}</span>
                        )}
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
    </div>
  );
};

export default FamilyMemberPage;
