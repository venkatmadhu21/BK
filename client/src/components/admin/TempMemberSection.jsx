import React from 'react';
import { User, Calendar, MapPin, Users, Edit } from 'lucide-react';

const Field = ({ label, children, required }) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </span>
    {children}
  </label>
);

const Input = ({ label, required, ...props }) => (
  <Field label={label} required={required}>
    <input
      {...props}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
    />
  </Field>
);

const Select = ({ label, options = [], required = false, ...props }) => (
  <Field label={label} required={required}>
    <select
      {...props}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
    >
      {options.map(({ label: optionLabel, value }) => (
        <option key={value} value={value}>
          {optionLabel}
        </option>
      ))}
    </select>
  </Field>
);

const TextArea = ({ label, rows = 4, ...props }) => (
  <Field label={label}>
    <textarea
      {...props}
      rows={rows}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
    />
  </Field>
);

const SectionCard = ({ title, icon: Icon, subtitle, children }) => (
  <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
    <header className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
      {Icon && <Icon size={18} className="text-green-500" />}
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </header>
    <div className="space-y-4 px-4 py-5">
      {children}
    </div>
  </section>
);

const Grid = ({ cols = 2, children }) => (
  <div className={`grid gap-4 ${cols === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
    {children}
  </div>
);

const createOptions = (values) => values.map((value) => ({ label: value, value }));

const yesNoOptions = createOptions(['yes', 'no']);
const relationOptions = createOptions([
  'Self',
  'Father',
  'Mother',
  'Brother',
  'Sister',
  'Spouse',
  'Child',
  'Other',
]);

const TempMemberSection = ({ formData, onChange }) => {
  if (!formData) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
        No temp member data.
      </div>
    );
  }

  const handleField = (path, value) => {
    const segments = path.split('.');
    const updated = { ...formData };
    let cursor = updated;

    segments.forEach((segment, index) => {
      if (index === segments.length - 1) {
        cursor[segment] = value;
      } else {
        cursor[segment] = cursor[segment] ? { ...cursor[segment] } : {};
        cursor = cursor[segment];
      }
    });

    onChange(updated);
  };

  const getFieldValue = (path, fallback = '') => {
    const segments = path.split('.');
    let cursor = formData;
    for (let i = 0; i < segments.length; i += 1) {
      cursor = cursor?.[segments[i]];
      if (cursor === undefined || cursor === null) {
        return fallback;
      }
    }
    return cursor;
  };

  const renderGuardian = (guardianKey, title) => (
    <SectionCard title={title} icon={User}>
      <Grid>
        <Input
          label="First Name"
          value={getFieldValue(`${guardianKey}.firstName`)}
          onChange={(event) => handleField(`${guardianKey}.firstName`, event.target.value)}
        />
        <Input
          label="Last Name"
          value={getFieldValue(`${guardianKey}.lastName`)}
          onChange={(event) => handleField(`${guardianKey}.lastName`, event.target.value)}
        />
        <Input
          label="Contact"
          value={getFieldValue(`${guardianKey}.contactNumber`)}
          onChange={(event) => handleField(`${guardianKey}.contactNumber`, event.target.value)}
        />
        <Select
          label="Relation"
          options={relationOptions}
          value={getFieldValue(`${guardianKey}.relation`, '')}
          onChange={(event) => handleField(`${guardianKey}.relation`, event.target.value)}
        />
      </Grid>
    </SectionCard>
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title="Applicant Details"
        icon={User}
        subtitle="Primary information about the applicant"
      >
        <Grid cols={3}>
          <Input
            label="First Name"
            required
            value={getFieldValue('firstName')}
            onChange={(event) => handleField('firstName', event.target.value)}
          />
          <Input
            label="Middle Name"
            value={getFieldValue('middleName')}
            onChange={(event) => handleField('middleName', event.target.value)}
          />
          <Input
            label="Last Name"
            required
            value={getFieldValue('lastName')}
            onChange={(event) => handleField('lastName', event.target.value)}
          />
        </Grid>

        <Grid>
          <Select
            label="Gender"
            options={createOptions(['Male', 'Female', 'Other'])}
            value={getFieldValue('gender', 'Male')}
            onChange={(event) => handleField('gender', event.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={getFieldValue('email')}
            onChange={(event) => handleField('email', event.target.value)}
          />
          <Input
            label="Mobile"
            value={getFieldValue('mobile')}
            onChange={(event) => handleField('mobile', event.target.value)}
          />
          <Input
            label="Alternate Mobile"
            value={getFieldValue('alternateMobile')}
            onChange={(event) => handleField('alternateMobile', event.target.value)}
          />
        </Grid>

        <Grid>
          <DateInput
            label="Date of Birth"
            value={getFieldValue('dateOfBirth')}
            onChange={(event) => handleField('dateOfBirth', event.target.value)}
          />
          <DateInput
            label="Date of Wedding"
            value={getFieldValue('dateOfWedding')}
            onChange={(event) => handleField('dateOfWedding', event.target.value)}
          />
          <Input
            label="Occupation"
            value={getFieldValue('occupation')}
            onChange={(event) => handleField('occupation', event.target.value)}
          />
          <Input
            label="Education"
            value={getFieldValue('education')}
            onChange={(event) => handleField('education', event.target.value)}
          />
        </Grid>
      </SectionCard>

      <SectionCard title="Address" icon={MapPin}>
        <Grid>
          <Input
            label="Country"
            value={getFieldValue('address.country', 'India')}
            onChange={(event) => handleField('address.country', event.target.value)}
          />
          <Input
            label="State"
            value={getFieldValue('address.state')}
            onChange={(event) => handleField('address.state', event.target.value)}
          />
          <Input
            label="City"
            value={getFieldValue('address.city')}
            onChange={(event) => handleField('address.city', event.target.value)}
          />
          <Input
            label="Area"
            value={getFieldValue('address.area')}
            onChange={(event) => handleField('address.area', event.target.value)}
          />
          <Input
            label="Colony"
            value={getFieldValue('address.colony')}
            onChange={(event) => handleField('address.colony', event.target.value)}
          />
          <Input
            label="Pin Code"
            value={getFieldValue('address.pinCode')}
            onChange={(event) => handleField('address.pinCode', event.target.value)}
          />
        </Grid>
        <Input
          label="Street Address"
          value={getFieldValue('address.street')}
          onChange={(event) => handleField('address.street', event.target.value)}
        />
      </SectionCard>

      <SectionCard title="Family Information" icon={Users}>
        <Grid>
          <Input
            label="Family Ser No"
            value={getFieldValue('familySerNo')}
            onChange={(event) => handleField('familySerNo', event.target.value)}
          />
          <Input
            label="Vansh"
            value={getFieldValue('vansh')}
            onChange={(event) => handleField('vansh', event.target.value)}
          />
          <Input
            label="Spouse Ser No"
            value={getFieldValue('spouseSerNo')}
            onChange={(event) => handleField('spouseSerNo', event.target.value)}
          />
          <Select
            label="Spouse Relation"
            options={relationOptions}
            value={getFieldValue('spouseRelation', '')}
            onChange={(event) => handleField('spouseRelation', event.target.value)}
          />
        </Grid>

        <TextArea
          label="Additional Notes"
          rows={4}
          value={getFieldValue('notes')}
          onChange={(event) => handleField('notes', event.target.value)}
        />
      </SectionCard>

      {renderGuardian('guardianOne', 'Primary Guardian')}
      {renderGuardian('guardianTwo', 'Secondary Guardian')}
    </div>
  );
};

const DateInput = (props) => <Input type="date" {...props} />;

export default TempMemberSection;