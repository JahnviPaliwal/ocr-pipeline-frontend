'use client';

import { ConfidenceScores, CredentialInfo, ExtractionData, HolderInfo, IssuerInfo } from '../lib/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function ConfidenceBadge({ score }: { score?: number | null }) {
  if (!score) return null;
  const cls = score >= 90 ? 'bg-emerald-100 text-emerald-700'
    : score >= 70 ? 'bg-amber-100 text-amber-700'
    : 'bg-red-100 text-red-700';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls}`}>{score}%</span>;
}

function FieldRow({ label, value, confidence, mono }: {
  label: string; value?: string | null; confidence?: number | null; mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-2 py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-slate-500 text-sm min-w-[130px] flex-shrink-0 capitalize">
        {label.replace(/_/g, ' ')}
      </span>
      <div className="flex items-center gap-2 justify-end flex-wrap">
        <span className={`text-sm font-semibold text-right break-all ${mono ? 'font-mono' : ''} ${!value ? 'text-slate-300 italic font-normal' : 'text-slate-800'}`}>
          {value || 'Not found'}
        </span>
        <ConfidenceBadge score={confidence} />
      </div>
    </div>
  );
}

function Section({ icon, title, color, children }: {
  icon: React.ReactNode; title: string; color: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-8 h-8 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>{icon}</div>
        <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── Document type badge ───────────────────────────────────────────────────────

const DOC_TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  aadhaar:           { label: 'Aadhaar Card',        emoji: '🪪' },
  passport:          { label: 'Passport',             emoji: '🛂' },
  pan_card:          { label: 'PAN Card',             emoji: '💳' },
  driving_license:   { label: 'Driving License',      emoji: '🚗' },
  degree_certificate:{ label: 'Degree Certificate',   emoji: '🎓' },
  marksheet:         { label: 'Mark Sheet',           emoji: '📋' },
  birth_certificate: { label: 'Birth Certificate',    emoji: '📜' },
  unknown:           { label: 'Document',             emoji: '📄' },
};

// ── Field groups per document type ───────────────────────────────────────────
// Keys must match what LLM returns in `fields`

const DOC_FIELD_GROUPS: Record<string, { title: string; color: string; emoji: string; fields: string[] }[]> = {
  aadhaar: [
    { title: 'Personal Info', color: 'bg-blue-100', emoji: '👤',
      fields: ['name', 'dob', 'gender', 'father_name', 'husband_name'] },
    { title: 'Aadhaar Details', color: 'bg-indigo-100', emoji: '🪪',
      fields: ['uid_number', 'vid', 'enrolment_number'] },
    { title: 'Address', color: 'bg-green-100', emoji: '🏠',
      fields: ['address', 'city', 'state', 'pincode'] },
  ],
  passport: [
    { title: 'Personal Info', color: 'bg-blue-100', emoji: '👤',
      fields: ['name', 'dob', 'gender', 'nationality', 'place_of_birth'] },
    { title: 'Passport Details', color: 'bg-indigo-100', emoji: '🛂',
      fields: ['passport_number', 'issue_date', 'expiry_date', 'place_of_issue'] },
    { title: 'Issuer', color: 'bg-amber-100', emoji: '🏛️',
      fields: ['issuing_authority', 'country'] },
  ],
  pan_card: [
    { title: 'Personal Info', color: 'bg-blue-100', emoji: '👤',
      fields: ['name', 'father_name', 'dob'] },
    { title: 'PAN Details', color: 'bg-indigo-100', emoji: '💳',
      fields: ['pan_number', 'issue_date'] },
  ],
  driving_license: [
    { title: 'Personal Info', color: 'bg-blue-100', emoji: '👤',
      fields: ['name', 'dob', 'gender', 'address'] },
    { title: 'License Details', color: 'bg-indigo-100', emoji: '🚗',
      fields: ['dl_number', 'issue_date', 'valid_till', 'vehicle_class'] },
    { title: 'Issuer', color: 'bg-amber-100', emoji: '🏛️',
      fields: ['issuing_authority', 'state'] },
  ],
  degree_certificate: [
    { title: 'Holder', color: 'bg-blue-100', emoji: '👤',
      fields: ['name', 'father_name', 'mother_name', 'dob'] },
    { title: 'Credential', color: 'bg-purple-100', emoji: '🎓',
      fields: ['degree', 'branch', 'specialization', 'institution', 'year', 'cgpa', 'percentage', 'roll_number'] },
    { title: 'Issuer', color: 'bg-amber-100', emoji: '🏛️',
      fields: ['issuing_authority', 'university'] },
  ],
  marksheet: [
    { title: 'Student Info', color: 'bg-blue-100', emoji: '👤',
      fields: ['name', 'father_name', 'mother_name', 'dob', 'roll_number', 'enrollment_number'] },
    { title: 'Academic Details', color: 'bg-purple-100', emoji: '📋',
      fields: ['institution', 'university', 'degree', 'branch', 'semester', 'year', 'cgpa', 'percentage', 'total_marks', 'marks_obtained', 'result'] },
    { title: 'Issuer', color: 'bg-amber-100', emoji: '🏛️',
      fields: ['issuing_authority', 'board'] },
  ],
  birth_certificate: [
    { title: 'Personal Info', color: 'bg-blue-100', emoji: '👤',
      fields: ['name', 'dob', 'gender', 'place_of_birth'] },
    { title: 'Parents Info', color: 'bg-green-100', emoji: '👨‍👩‍👦',
      fields: ['father_name', 'mother_name', 'address'] },
    { title: 'Certificate Details', color: 'bg-amber-100', emoji: '📜',
      fields: ['certificate_number', 'issue_date', 'issuing_authority'] },
  ],
};

// ── Icons ────────────────────────────────────────────────────────────────────

function EmojiIcon({ emoji }: { emoji: string }) {
  return <span className="text-base">{emoji}</span>;
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  data: ExtractionData;
}

export default function ResultsCard({ data }: Props) {
  const docType = data.document_type || 'unknown';
  const fields = data.fields || {};
  const confidence = data.confidence || {};
  const typeInfo = DOC_TYPE_LABELS[docType] || DOC_TYPE_LABELS.unknown;
  const groups = DOC_FIELD_GROUPS[docType];

  // Collect all field keys that have values from LLM
  const allFieldKeys = Object.keys(fields).filter(k => fields[k] != null && fields[k] !== '');

  // Fields already shown in groups (to avoid duplication in "Other" section)
  const shownKeys = new Set(groups?.flatMap(g => g.fields) ?? []);

  // Extra fields not in any group
  const extraKeys = allFieldKeys.filter(k => !shownKeys.has(k));

  return (
    <div className="space-y-4">
      {/* Document type badge */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{typeInfo.emoji}</span>
        <span className="font-bold text-slate-700 text-sm">{typeInfo.label}</span>
        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-mono">{docType}</span>
        {data.pageCount && data.pageCount > 1 && (
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium ml-1">
            {data.pageCount} pages
          </span>
        )}
      </div>

      {/* Dynamic groups based on doc type */}
      {groups ? (
        groups.map(group => {
          // Only show group if at least one field has a value
          const groupFields = group.fields.filter(f => fields[f] != null && fields[f] !== '');
          // Also check legacy holder/credential for backwards compat
          const hasContent = groupFields.length > 0
            || (group.fields.includes('name') && data.holder?.name)
            || (group.fields.includes('degree') && data.credential?.degree);

          if (!hasContent) return null;

          return (
            <Section key={group.title} icon={<EmojiIcon emoji={group.emoji} />} title={group.title} color={group.color}>
              {group.fields.map(fieldKey => {
                // Prefer dynamic fields, fall back to legacy holder/credential
                let value: string | null = fields[fieldKey] ?? null;
                let conf: number | null = null;

                // Legacy fallback mapping
                if (!value) {
                  if (fieldKey === 'name') { value = data.holder?.name ?? null; conf = confidence.name ?? null; }
                  else if (fieldKey === 'father_name') { value = data.holder?.fatherName ?? null; conf = confidence.fatherName ?? null; }
                  else if (fieldKey === 'dob') { value = data.holder?.dob ?? null; conf = confidence.dob ?? null; }
                  else if (fieldKey === 'degree') { value = data.credential?.degree ?? null; conf = confidence.degree ?? null; }
                  else if (fieldKey === 'institution' || fieldKey === 'university') { value = data.credential?.institution ?? null; conf = confidence.institution ?? null; }
                  else if (fieldKey === 'year') { value = data.credential?.year ?? null; conf = confidence.year ?? null; }
                  else if (fieldKey === 'cgpa') { value = data.credential?.cgpa ?? null; conf = confidence.cgpa ?? null; }
                } else {
                  // Assign confidence from known keys
                  const confMap: Record<string, number | null | undefined> = {
                    name: confidence.name, father_name: confidence.fatherName,
                    dob: confidence.dob, degree: confidence.degree,
                    institution: confidence.institution, university: confidence.institution,
                    year: confidence.year, cgpa: confidence.cgpa,
                  };
                  conf = confMap[fieldKey] ?? null;
                }

                if (!value) return null;

                const isMono = ['uid_number','pan_number','passport_number','dl_number','roll_number','enrollment_number','dob','year','cgpa','percentage','pincode','certificate_number'].includes(fieldKey);

                return (
                  <FieldRow key={fieldKey} label={fieldKey} value={value} confidence={conf} mono={isMono} />
                );
              })}
            </Section>
          );
        })
      ) : (
        // Unknown doc type — show holder/credential/issuer as before
        <>
          {(data.holder?.name || data.holder?.dob) && (
            <Section icon={<EmojiIcon emoji="👤" />} title="Holder" color="bg-blue-100">
              <FieldRow label="name" value={data.holder.name} confidence={confidence.name} />
              <FieldRow label="father_name" value={data.holder.fatherName} confidence={confidence.fatherName} />
              <FieldRow label="dob" value={data.holder.dob} confidence={confidence.dob} mono />
            </Section>
          )}
          {(data.credential?.degree || data.credential?.institution) && (
            <Section icon={<EmojiIcon emoji="🎓" />} title="Credential" color="bg-purple-100">
              <FieldRow label="degree" value={data.credential.degree} confidence={confidence.degree} />
              <FieldRow label="institution" value={data.credential.institution} confidence={confidence.institution} />
              <FieldRow label="year" value={data.credential.year} confidence={confidence.year} mono />
              <FieldRow label="cgpa" value={data.credential.cgpa} confidence={confidence.cgpa} mono />
            </Section>
          )}
          {data.issuer?.name && (
            <Section icon={<EmojiIcon emoji="🏛️" />} title="Issuer" color="bg-amber-100">
              <FieldRow label="issuer" value={data.issuer.name} />
            </Section>
          )}
        </>
      )}

      {/* Extra fields LLM found but not in any group */}
      {extraKeys.length > 0 && (
        <Section icon={<EmojiIcon emoji="📌" />} title="Additional Fields" color="bg-slate-100">
          {extraKeys.map(k => (
            <FieldRow key={k} label={k} value={String(fields[k])} />
          ))}
        </Section>
      )}

      {/* No data at all */}
      {!groups && allFieldKeys.length === 0 && !data.holder?.name && !data.credential?.degree && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center">
          <p className="text-amber-700 font-semibold text-sm mb-1">No data could be extracted</p>
          <p className="text-amber-600 text-xs">Try a clearer scan at 300+ DPI. Check the Raw OCR Text to see what was read.</p>
        </div>
      )}

      {/* Confidence legend */}
      <div className="flex items-center gap-3 flex-wrap text-xs bg-slate-50 rounded-xl px-4 py-2.5">
        <span className="text-slate-500 font-medium">Confidence:</span>
        <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">≥90% High</span>
        <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">70–89% Medium</span>
        <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">&lt;70% Low</span>
      </div>
    </div>
  );
}
