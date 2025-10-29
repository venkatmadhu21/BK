import React, { useState } from 'react';
import { Calendar, Phone, User, Mail, MapPin, Info, HeartCrack, Upload, X } from 'lucide-react';

const FormGroup = ({ label, children, required = false }) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </span>
    {children}
  </label>
);

const TextInput = ({ label, required, ...props }) => (
  <FormGroup label={label} required={required}>
    <input
      {...props}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
    />
  </FormGroup>
);

const DateInput = ({ label, ...props }) => (
  <FormGroup label={label}>
    <input
      type="date"
      {...props}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
    />
  </FormGroup>
);

const SelectInput = ({ label, options = [], required = false, ...props }) => (
  <FormGroup label={label} required={required}>
    <select
      {...props}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
    >
      {options.map(({ label: optionLabel, value }) => (
        <option key={value} value={value}>
          {optionLabel}
        </option>
      ))}
    </select>
  </FormGroup>
);

const SectionCard = ({ title, icon: Icon, children, subtitle, actions }) => (
  <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
      <div className="flex items-center gap-2 text-gray-800">
        {Icon && <Icon size={18} className="text-orange-500" />}
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {actions}
    </div>
    <div className="space-y-4 px-4 py-5">
      {children}
    </div>
  </section>
);

const TwoColumnGrid = ({ children }) => (
  <div className="grid gap-4 md:grid-cols-2">{children}</div>
);

const ThreeColumnGrid = ({ children }) => (
  <div className="grid gap-4 md:grid-cols-3">{children}</div>
);

const createOptions = (values) => values.map((value) => ({ label: value, value }));

const yesNoOptions = createOptions(['yes', 'no']);
const genderOptions = createOptions(['male', 'female', 'other']);

const EmptyState = ({ title, description, action }) => (
  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
    <p className="text-sm font-medium text-gray-700">{title}</p>
    {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
    {action && <div className="mt-3 flex justify-center">{action}</div>}
  </div>
);

const ActionsRow = ({ children }) => (
  <div className="flex flex-wrap items-center gap-2">{children}</div>
);

const ControlButton = ({ variant = 'primary', icon: Icon, label, ...props }) => {
  const variants = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-200',
    outline: 'border border-orange-200 text-orange-600 hover:bg-orange-50 focus:ring-orange-200',
    ghost: 'text-orange-600 hover:text-orange-700',
  };

  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition focus:outline-none focus:ring-2 ${variants[variant]}`}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
};

const ImageField = ({ label, value = {}, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState(() => {
    if (value?.data && value?.mimeType) {
      return `data:${value.mimeType};base64,${value.data}`;
    }
    return null;
  });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result?.split(',')[1];
        const mimeType = file.type || 'image/jpeg';
        setPreviewUrl(e.target?.result);
        onChange({
          data: base64String,
          mimeType: mimeType,
          originalName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onChange({
      data: '',
      mimeType: '',
      originalName: ''
    });
  };

  return (
    <FormGroup label={label}>
      <div className="flex flex-col gap-3">
        {previewUrl && (
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 rounded-lg border border-gray-300 object-cover shadow-sm"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 transition">
            <Upload size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {previewUrl ? 'Change Image' : 'Upload Image'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {value?.originalName && (
            <p className="text-xs text-gray-500">
              File: {value.originalName}
            </p>
          )}
        </div>

        <details className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <summary className="cursor-pointer font-medium text-sm text-gray-700">
            Advanced: Manual Base64 Entry
          </summary>
          <div className="grid gap-3 md:grid-cols-2 mt-3">
            <TextInput
              label="Base64 Data"
              placeholder="Paste base64 string"
              value={value.data || ''}
              onChange={(event) => onChange({ ...value, data: event.target.value })}
            />
            <TextInput
              label="MIME Type"
              placeholder="image/jpeg"
              value={value.mimeType || ''}
              onChange={(event) => onChange({ ...value, mimeType: event.target.value })}
            />
          </div>
          <TextInput
            label="Original File Name"
            placeholder="profile.jpg"
            value={value.originalName || ''}
            onChange={(event) => onChange({ ...value, originalName: event.target.value })}
          />
        </details>
      </div>
    </FormGroup>
  );
};

const HierarchyFormSection = ({ formData, onChange }) => {
  if (!formData) {
    return (
      <EmptyState
        title="No hierarchy form data"
        description="Use the add button to start a new hierarchy form entry."
      />
    );
  }

  const updateSection = (key, value) => {
    onChange({ ...formData, [key]: value });
  };

  const updatePersonal = (key, value) => {
    updateSection('personalDetails', { ...formData.personalDetails, [key]: value });
  };

  const updateNestedSection = (sectionKey, updater) => {
    const section = formData[sectionKey] ?? {};
    updateSection(sectionKey, updater(section));
  };

  const removeSection = (sectionKey) => {
    const updated = { ...formData };
    delete updated[sectionKey];
    onChange(updated);
  };

  const SectionToggle = ({ sectionKey, title, description, icon, render }) => {
    const sectionValue = formData[sectionKey];
    const hasSection = Boolean(sectionValue);

    return (
      <SectionCard
        title={title}
        icon={icon}
        subtitle={description}
        actions={
          <ControlButton
            variant={hasSection ? 'outline' : 'primary'}
            label={hasSection ? 'Remove Section' : 'Add Section'}
            icon={hasSection ? HeartCrack : User}
            onClick={() => {
              if (hasSection) {
                removeSection(sectionKey);
              } else {
                updateSection(sectionKey, {});
              }
            }}
          />
        }
      >
        {hasSection ? render(sectionValue) : (
          <EmptyState
            title="Section not added"
            description="Use the action button to include this section in the submission."
          />
        )}
      </SectionCard>
    );
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Personal Details"
        icon={User}
        subtitle="Who submitted this information?"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            required
            value={formData.personalDetails?.firstName || ''}
            onChange={(event) => updatePersonal('firstName', event.target.value)}
          />
          <TextInput
            label="Middle Name"
            placeholder="Enter middle name"
            value={formData.personalDetails?.middleName || ''}
            onChange={(event) => updatePersonal('middleName', event.target.value)}
          />
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            required
            value={formData.personalDetails?.lastName || ''}
            onChange={(event) => updatePersonal('lastName', event.target.value)}
          />
        </div>

        <ThreeColumnGrid>
          <SelectInput
            label="Gender"
            options={genderOptions}
            value={formData.personalDetails?.gender || 'male'}
            onChange={(event) => updatePersonal('gender', event.target.value)}
          />
          <DateInput
            label="Date of Birth"
            value={formData.personalDetails?.dateOfBirth || ''}
            onChange={(event) => updatePersonal('dateOfBirth', event.target.value)}
          />
          <SelectInput
            label="Confirmed Date of Birth?"
            options={yesNoOptions}
            value={formData.personalDetails?.confirmDateOfBirth || 'yes'}
            onChange={(event) => updatePersonal('confirmDateOfBirth', event.target.value)}
          />
        </ThreeColumnGrid>

        <ThreeColumnGrid>
          <SelectInput
            label="Alive?"
            options={yesNoOptions}
            value={formData.personalDetails?.isAlive || 'yes'}
            onChange={(event) => updatePersonal('isAlive', event.target.value)}
          />
          <DateInput
            label="Date of Death"
            value={formData.personalDetails?.dateOfDeath || ''}
            onChange={(event) => updatePersonal('dateOfDeath', event.target.value)}
          />
          <SelectInput
            label="Confirmed Date of Death?"
            options={yesNoOptions}
            value={formData.personalDetails?.confirmDateOfDeath || 'no'}
            onChange={(event) => updatePersonal('confirmDateOfDeath', event.target.value)}
          />
        </ThreeColumnGrid>

        <ThreeColumnGrid>
          <TextInput
            label="Email"
            placeholder="name@example.com"
            value={formData.personalDetails?.email || ''}
            onChange={(event) => updatePersonal('email', event.target.value)}
            type="email"
          />
          <TextInput
            label="Mobile Number"
            placeholder="Enter mobile number"
            value={formData.personalDetails?.mobileNumber || ''}
            onChange={(event) => updatePersonal('mobileNumber', event.target.value)}
          />
          <TextInput
            label="Alternate Mobile"
            placeholder="Alternate mobile number"
            value={formData.personalDetails?.alternateMobileNumber || ''}
            onChange={(event) => updatePersonal('alternateMobileNumber', event.target.value)}
          />
        </ThreeColumnGrid>

        <div className="grid gap-4 md:grid-cols-3">
          <TextInput
            label="Profession"
            placeholder="Enter profession"
            value={formData.personalDetails?.profession || ''}
            onChange={(event) => updatePersonal('profession', event.target.value)}
          />
          <TextInput
            label="Qualifications"
            placeholder="Enter qualifications"
            value={formData.personalDetails?.qualifications || ''}
            onChange={(event) => updatePersonal('qualifications', event.target.value)}
          />
          <SelectInput
            label="Ever Married?"
            options={yesNoOptions}
            value={formData.personalDetails?.everMarried || 'no'}
            onChange={(event) => updatePersonal('everMarried', event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormGroup label="About Yourself">
            <textarea
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Tell us a little about yourself"
              value={formData.personalDetails?.aboutYourself || ''}
              onChange={(event) => updatePersonal('aboutYourself', event.target.value)}
            />
          </FormGroup>
          <ImageField
            label="Profile Image"
            value={formData.personalDetails?.profileImage}
            onChange={(value) => updatePersonal('profileImage', value)}
          />
        </div>

        <SectionCard title="Address" icon={MapPin}>
          <div className="grid gap-4 md:grid-cols-3">
            <TextInput
              label="Country"
              value={formData.personalDetails?.country || 'India'}
              onChange={(event) => updatePersonal('country', event.target.value)}
            />
            <TextInput
              label="State"
              value={formData.personalDetails?.state || ''}
              onChange={(event) => updatePersonal('state', event.target.value)}
            />
            <TextInput
              label="District"
              value={formData.personalDetails?.district || ''}
              onChange={(event) => updatePersonal('district', event.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <TextInput
              label="City"
              value={formData.personalDetails?.city || ''}
              onChange={(event) => updatePersonal('city', event.target.value)}
            />
            <TextInput
              label="Area"
              value={formData.personalDetails?.area || ''}
              onChange={(event) => updatePersonal('area', event.target.value)}
            />
            <TextInput
              label="Colony / Street"
              value={formData.personalDetails?.colonyStreet || ''}
              onChange={(event) => updatePersonal('colonyStreet', event.target.value)}
            />
          </div>

          <ThreeColumnGrid>
            <TextInput
              label="Flat / Plot Number"
              value={formData.personalDetails?.flatPlotNumber || ''}
              onChange={(event) => updatePersonal('flatPlotNumber', event.target.value)}
            />
            <TextInput
              label="Building Number"
              value={formData.personalDetails?.buildingNumber || ''}
              onChange={(event) => updatePersonal('buildingNumber', event.target.value)}
            />
            <TextInput
              label="Pin Code"
              value={formData.personalDetails?.pinCode || ''}
              onChange={(event) => updatePersonal('pinCode', event.target.value)}
            />
          </ThreeColumnGrid>
        </SectionCard>
      </SectionCard>

      <SectionToggle
        sectionKey="marriedDetails"
        title="Married Details"
        description={`Marriage information for ${[formData.personalDetails?.firstName, formData.personalDetails?.middleName, formData.personalDetails?.lastName].filter(Boolean).join(' ') || 'Member'}`}
        icon={HeartCrack}
        render={(section) => (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-4">
              <p className="text-sm font-medium text-blue-900">
                Member: <span className="font-semibold">{[formData.personalDetails?.firstName, formData.personalDetails?.middleName, formData.personalDetails?.lastName].filter(Boolean).join(' ') || 'N/A'}</span>
              </p>
            </div>
            <TwoColumnGrid>
              <TextInput
                label="Spouse First Name"
                value={section.spouseFirstName || ''}
                onChange={(event) => updateNestedSection('marriedDetails', (current) => ({
                  ...current,
                  spouseFirstName: event.target.value,
                }))}
              />
              <TextInput
                label="Spouse Last Name"
                value={section.spouseLastName || ''}
                onChange={(event) => updateNestedSection('marriedDetails', (current) => ({
                  ...current,
                  spouseLastName: event.target.value,
                }))}
              />
            </TwoColumnGrid>
            <TwoColumnGrid>
              <DateInput
                label="Date of Marriage"
                value={section.dateOfMarriage || ''}
                onChange={(event) => updateNestedSection('marriedDetails', (current) => ({
                  ...current,
                  dateOfMarriage: event.target.value,
                }))}
              />
              <DateInput
                label="Spouse Date of Birth"
                value={section.spouseDateOfBirth || ''}
                onChange={(event) => updateNestedSection('marriedDetails', (current) => ({
                  ...current,
                  spouseDateOfBirth: event.target.value,
                }))}
              />
            </TwoColumnGrid>
            <ImageField
              label="Spouse Profile Image"
              value={section.spouseProfileImage}
              onChange={(value) => updateNestedSection('marriedDetails', (current) => ({
                ...current,
                spouseProfileImage: value,
              }))}
            />
            <TextInput
              label="Description"
              value={section.description || ''}
              onChange={(event) => updateNestedSection('marriedDetails', (current) => ({
                ...current,
                description: event.target.value,
              }))}
            />
          </div>
        )}
      />

      <SectionToggle
        sectionKey="divorcedDetails"
        title="Divorced Details"
        description={`Divorce information for ${[formData.personalDetails?.firstName, formData.personalDetails?.middleName, formData.personalDetails?.lastName].filter(Boolean).join(' ') || 'Member'}`}
        icon={Info}
        render={(section) => (
          <div className="space-y-4">
            <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 mb-4">
              <p className="text-sm font-medium text-orange-900">
                Member: <span className="font-semibold">{[formData.personalDetails?.firstName, formData.personalDetails?.middleName, formData.personalDetails?.lastName].filter(Boolean).join(' ') || 'N/A'}</span>
              </p>
            </div>
            <TwoColumnGrid>
              <TextInput
                label="Spouse First Name"
                value={section.spouseFirstName || ''}
                onChange={(event) => updateNestedSection('divorcedDetails', (current) => ({
                  ...current,
                  spouseFirstName: event.target.value,
                }))}
              />
              <TextInput
                label="Spouse Last Name"
                value={section.spouseLastName || ''}
                onChange={(event) => updateNestedSection('divorcedDetails', (current) => ({
                  ...current,
                  spouseLastName: event.target.value,
                }))}
              />
            </TwoColumnGrid>
            <TwoColumnGrid>
              <DateInput
                label="Date of Divorce"
                value={section.dateOfDivorce || ''}
                onChange={(event) => updateNestedSection('divorcedDetails', (current) => ({
                  ...current,
                  dateOfDivorce: event.target.value,
                }))}
              />
              <SelectInput
                label="Ever Widowed?"
                options={yesNoOptions}
                value={section.everWidowed || 'no'}
                onChange={(event) => updateNestedSection('divorcedDetails', (current) => ({
                  ...current,
                  everWidowed: event.target.value,
                }))}
              />
            </TwoColumnGrid>
            <ImageField
              label="Spouse Profile Image"
              value={section.spouseProfileImage}
              onChange={(value) => updateNestedSection('divorcedDetails', (current) => ({
                ...current,
                spouseProfileImage: value,
              }))}
            />
            <TextInput
              label="Description"
              value={section.description || ''}
              onChange={(event) => updateNestedSection('divorcedDetails', (current) => ({
                ...current,
                description: event.target.value,
              }))}
            />
          </div>
        )}
      />

      <SectionToggle
        sectionKey="remarriedDetails"
        title="Remarried Details"
        description={`Remarriage information for ${[formData.personalDetails?.firstName, formData.personalDetails?.middleName, formData.personalDetails?.lastName].filter(Boolean).join(' ') || 'Member'}`}
        icon={HeartCrack}
        render={(section) => (
          <div className="space-y-4">
            <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 mb-4">
              <p className="text-sm font-medium text-purple-900">
                Member: <span className="font-semibold">{[formData.personalDetails?.firstName, formData.personalDetails?.middleName, formData.personalDetails?.lastName].filter(Boolean).join(' ') || 'N/A'}</span>
              </p>
            </div>
            <TwoColumnGrid>
              <TextInput
                label="Spouse First Name"
                value={section.spouseFirstName || ''}
                onChange={(event) => updateNestedSection('remarriedDetails', (current) => ({
                  ...current,
                  spouseFirstName: event.target.value,
                }))}
              />
              <TextInput
                label="Spouse Last Name"
                value={section.spouseLastName || ''}
                onChange={(event) => updateNestedSection('remarriedDetails', (current) => ({
                  ...current,
                  spouseLastName: event.target.value,
                }))}
              />
            </TwoColumnGrid>
            <TwoColumnGrid>
              <DateInput
                label="Date of Marriage"
                value={section.dateOfMarriage || ''}
                onChange={(event) => updateNestedSection('remarriedDetails', (current) => ({
                  ...current,
                  dateOfMarriage: event.target.value,
                }))}
              />
              <DateInput
                label="Spouse Date of Birth"
                value={section.spouseDateOfBirth || ''}
                onChange={(event) => updateNestedSection('remarriedDetails', (current) => ({
                  ...current,
                  spouseDateOfBirth: event.target.value,
                }))}
              />
            </TwoColumnGrid>
            <ImageField
              label="Spouse Profile Image"
              value={section.spouseProfileImage}
              onChange={(value) => updateNestedSection('remarriedDetails', (current) => ({
                ...current,
                spouseProfileImage: value,
              }))}
            />
            <TextInput
              label="Description"
              value={section.description || ''}
              onChange={(event) => updateNestedSection('remarriedDetails', (current) => ({
                ...current,
                description: event.target.value,
              }))}
            />
          </div>
        )}
      />

      <SectionToggle
        sectionKey="widowedDetails"
        title="Widowed Details"
        description={`Widowed information for ${[formData.personalDetails?.firstName, formData.personalDetails?.middleName, formData.personalDetails?.lastName].filter(Boolean).join(' ') || 'Member'}`}
        icon={Info}
        render={(section) => (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 border border-gray-300 p-3 mb-4">
              <p className="text-sm font-medium text-gray-900">
                Member: <span className="font-semibold">{[formData.personalDetails?.firstName, formData.personalDetails?.middleName, formData.personalDetails?.lastName].filter(Boolean).join(' ') || 'N/A'}</span>
              </p>
            </div>
            <TwoColumnGrid>
              <TextInput
                label="Spouse First Name"
                value={section.spouseFirstName || ''}
                onChange={(event) => updateNestedSection('widowedDetails', (current) => ({
                  ...current,
                  spouseFirstName: event.target.value,
                }))}
              />
              <TextInput
                label="Spouse Last Name"
                value={section.spouseLastName || ''}
                onChange={(event) => updateNestedSection('widowedDetails', (current) => ({
                  ...current,
                  spouseLastName: event.target.value,
                }))}
              />
            </TwoColumnGrid>
            <TwoColumnGrid>
              <DateInput
                label="Spouse Date of Death"
                value={section.spouseDateOfDeath || ''}
                onChange={(event) => updateNestedSection('widowedDetails', (current) => ({
                  ...current,
                  spouseDateOfDeath: event.target.value,
                }))}
              />
              <SelectInput
                label="Ever Remarried?"
                options={yesNoOptions}
                value={section.everRemarried || 'no'}
                onChange={(event) => updateNestedSection('widowedDetails', (current) => ({
                  ...current,
                  everRemarried: event.target.value,
                }))}
              />
            </TwoColumnGrid>
            <ImageField
              label="Spouse Profile Image"
              value={section.spouseProfileImage}
              onChange={(value) => updateNestedSection('widowedDetails', (current) => ({
                ...current,
                spouseProfileImage: value,
              }))}
            />
            <TextInput
              label="Description"
              value={section.description || ''}
              onChange={(event) => updateNestedSection('widowedDetails', (current) => ({
                ...current,
                description: event.target.value,
              }))}
            />
          </div>
        )}
      />

      <SectionToggle
        sectionKey="parentsInformation"
        title="Parents Information"
        description="Details about parents"
        icon={User}
        render={(section) => (
          <div className="space-y-4">
            <SectionCard title="Father" icon={User}>
              <TwoColumnGrid>
                <TextInput
                  label="First Name"
                  value={section.fatherFirstName || ''}
                  onChange={(event) => updateNestedSection('parentsInformation', (current) => ({
                    ...current,
                    fatherFirstName: event.target.value,
                  }))}
                />
                <TextInput
                  label="Last Name"
                  value={section.fatherLastName || ''}
                  onChange={(event) => updateNestedSection('parentsInformation', (current) => ({
                    ...current,
                    fatherLastName: event.target.value,
                  }))}
                />
              </TwoColumnGrid>
              <TwoColumnGrid>
                <DateInput
                  label="Date of Birth"
                  value={section.fatherDateOfBirth || ''}
                  onChange={(event) => updateNestedSection('parentsInformation', (current) => ({
                    ...current,
                    fatherDateOfBirth: event.target.value,
                  }))}
                />
                <TextInput
                  label="Mobile Number"
                  value={section.fatherMobileNumber || ''}
                  onChange={(event) => updateNestedSection('parentsInformation', (current) => ({
                    ...current,
                    fatherMobileNumber: event.target.value,
                  }))}
                />
              </TwoColumnGrid>
              <ImageField
                label="Profile Image"
                value={section.fatherProfileImage}
                onChange={(value) => updateNestedSection('parentsInformation', (current) => ({
                  ...current,
                  fatherProfileImage: value,
                }))}
              />
            </SectionCard>

            <SectionCard title="Mother" icon={User}>
              <TwoColumnGrid>
                <TextInput
                  label="First Name"
                  value={section.motherFirstName || ''}
                  onChange={(event) => updateNestedSection('parentsInformation', (current) => ({
                    ...current,
                    motherFirstName: event.target.value,
                  }))}
                />
                <TextInput
                  label="Last Name"
                  value={section.motherLastName || ''}
                  onChange={(event) => updateNestedSection('parentsInformation', (current) => ({
                    ...current,
                    motherLastName: event.target.value,
                  }))}
                />
              </TwoColumnGrid>
              <TwoColumnGrid>
                <DateInput
                  label="Date of Birth"
                  value={section.motherDateOfBirth || ''}
                  onChange={(event) => updateNestedSection('parentsInformation', (current) => ({
                    ...current,
                    motherDateOfBirth: event.target.value,
                  }))}
                />
                <TextInput
                  label="Mobile Number"
                  value={section.motherMobileNumber || ''}
                  onChange={(event) => updateNestedSection('parentsInformation', (current) => ({
                    ...current,
                    motherMobileNumber: event.target.value,
                  }))}
                />
              </TwoColumnGrid>
              <ImageField
                label="Profile Image"
                value={section.motherProfileImage}
                onChange={(value) => updateNestedSection('parentsInformation', (current) => ({
                  ...current,
                  motherProfileImage: value,
                }))}
              />
            </SectionCard>
          </div>
        )}
      />
    </div>
  );
};

export default HierarchyFormSection;