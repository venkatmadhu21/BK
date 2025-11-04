import React from 'react';
import { CheckCircle, Clock, User, FileText, Users, Mail, AlertCircle, ArrowRight } from 'lucide-react';

/**
 * Visual guide for the 3-step family tree onboarding process
 * Shows users and admins exactly what happens at each stage
 */
const FamilyTreeOnboardingVisual = ({ currentStep = 'overview' }) => {
  const steps = [
    {
      id: 'step1',
      number: 1,
      title: 'User Submits Form',
      icon: FileText,
      duration: 'User Action',
      description: 'User fills comprehensive hierarchy form with personal details and family information',
      details: [
        '📋 Personal Details: Name, DOB, Gender, Email, Phone',
        '🏠 Address: Full address including pin code',
        '👨‍👩: Family Info: Father SerNo & Mother SerNo',
        '💍 Spouse: Spouse SerNo (if married)',
        '👶 Children: Children SerNos (if applicable)',
      ],
      color: 'blue',
      status: 'submitted',
    },
    {
      id: 'step2',
      number: 2,
      title: 'Admin Reviews & Approves',
      icon: Users,
      duration: 'Admin Action',
      description: 'Admin reviews all fields and clicks APPROVE button in admin dashboard',
      details: [
        '✓ Verify all required fields are filled',
        '✓ Check Father SerNo is valid (exists in tree)',
        '✓ Check Mother SerNo is valid (exists in tree)',
        '✓ Verify email format and phone number',
        '✓ Click ✅ APPROVE button',
      ],
      color: 'orange',
      status: 'pending',
    },
    {
      id: 'step3',
      number: 3,
      title: 'System Auto-Processes',
      icon: CheckCircle,
      duration: 'Automatic',
      description: 'System automatically creates all records and sends credentials to user',
      details: [
        '🔢 Generate SerNo: 148 (next available number)',
        '👤 Create Member Record: Stores family data',
        '👨‍👩‍👧 Update Parents: Add user to their children lists',
        '🔐 Create User Account: With temporary password',
        '📧 Send Email: Credentials to user email',
      ],
      color: 'green',
      status: 'completed',
    },
  ];

  return (
    <div className="w-full space-y-8 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 p-6 rounded-2xl">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          👨‍👩‍👧‍👦 Family Tree Member Onboarding
        </h2>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          Complete 3-step process to add new family members to the family tree system with automatic relationship linking
        </p>
      </div>

      {/* Main Flow Diagram */}
      <div className="space-y-4">
        {/* Step 1 */}
        <StepCard step={steps[0]} />

        {/* Arrow 1 */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-orange-500">
            <ArrowRight size={20} />
            <span className="text-xs font-semibold">Auto Approval</span>
          </div>
        </div>

        {/* Step 2 */}
        <StepCard step={steps[1]} />

        {/* Arrow 2 */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-orange-500">
            <ArrowRight size={20} />
            <span className="text-xs font-semibold">System Processing</span>
          </div>
        </div>

        {/* Step 3 */}
        <StepCard step={steps[2]} />
      </div>

      {/* Result Box */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <CheckCircle size={24} className="text-emerald-600" />
          <h3 className="text-xl font-bold text-emerald-900">User is Now Active in Family Tree! 🎉</h3>
        </div>
        <div className="grid md:grid-cols-4 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3 border border-emerald-200">
            <div className="font-bold text-emerald-700">SerNo Assigned</div>
            <div className="text-xs text-gray-600">Unique identifier: 148</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-emerald-200">
            <div className="font-bold text-emerald-700">Parents Linked</div>
            <div className="text-xs text-gray-600">Added to children lists</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-emerald-200">
            <div className="font-bold text-emerald-700">Account Created</div>
            <div className="text-xs text-gray-600">Ready to login</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-emerald-200">
            <div className="font-bold text-emerald-700">Email Sent</div>
            <div className="text-xs text-gray-600">With credentials</div>
          </div>
        </div>
      </div>

      {/* Data Structure Visual */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">📊 Data Created After Approval</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Left Column - New Records */}
          <div className="space-y-3">
            <DataBox 
              title="New Member Record"
              color="blue"
              items={[
                { label: 'SerNo', value: '148', highlight: true },
                { label: 'fatherSerNo', value: '10' },
                { label: 'motherSerNo', value: '12' },
                { label: 'spouseSerNo', value: '45 (if married)' },
                { label: 'childrenSerNos', value: '[80, 120]' },
              ]}
            />
            <DataBox 
              title="New User Account"
              color="purple"
              items={[
                { label: 'username', value: 'rajesh_148', highlight: true },
                { label: 'email', value: 'rajesh@example.com' },
                { label: 'password', value: '[hashed temp]' },
                { label: 'role', value: 'user' },
              ]}
            />
          </div>

          {/* Right Column - Updated Records */}
          <div className="space-y-3">
            <DataBox 
              title="Father Record (Updated)"
              color="indigo"
              items={[
                { label: 'SerNo', value: '10' },
                { label: 'childrenSerNos', value: '[50, 75, 148]', highlight: true },
                { label: 'Change', value: '← Added 148!' },
              ]}
            />
            <DataBox 
              title="Mother Record (Updated)"
              color="pink"
              items={[
                { label: 'SerNo', value: '12' },
                { label: 'childrenSerNos', value: '[51, 76, 148]', highlight: true },
                { label: 'Change', value: '← Added 148!' },
              ]}
            />
            <DataBox 
              title="Legacy Login Record"
              color="cyan"
              items={[
                { label: 'email', value: 'rajesh@example.com' },
                { label: 'username', value: 'rajesh_148' },
                { label: 'serNo', value: '148' },
                { label: 'purpose', value: 'Backup login' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex gap-3">
          <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="font-bold text-yellow-900">⚠️ Important Requirements</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>✓ Both Father and Mother SerNos MUST exist in the family tree</li>
              <li>✓ All fields marked with * are required</li>
              <li>✓ Email must be unique (not already used)</li>
              <li>✓ SerNo is auto-generated - cannot be manually set</li>
              <li>✓ Cannot be approved with missing required fields</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Admin Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <h3 className="font-bold text-blue-900 flex items-center gap-2">
          <Users size={18} />
          Admin: How to Approve Forms
        </h3>
        <ol className="text-sm text-blue-900 space-y-2 ml-6">
          <li><strong>1.</strong> Go to Admin Dashboard → Hierarchy Form Tab</li>
          <li><strong>2.</strong> Look for ❌ Unapproved forms</li>
          <li><strong>3.</strong> Click [View] to review all fields</li>
          <li><strong>4.</strong> Verify all required fields are filled</li>
          <li><strong>5.</strong> Check Father and Mother SerNos are valid</li>
          <li><strong>6.</strong> Click [✅ APPROVE] button</li>
          <li><strong>7.</strong> Wait for success message</li>
          <li><strong>8.</strong> Check member appears in Family Members tab</li>
        </ol>
      </div>

      {/* User Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
        <h3 className="font-bold text-green-900 flex items-center gap-2">
          <User size={18} />
          User: What Happens After Approval
        </h3>
        <div className="text-sm text-green-900 space-y-2">
          <p>Once admin approves your form, you'll receive:</p>
          <div className="bg-white rounded border border-green-200 p-3 space-y-2">
            <p><Mail size={16} className="inline mr-2" />📧 <strong>Email with credentials</strong></p>
            <p className="ml-6 text-xs">Contains: SerNo, Username, Temporary Password</p>
            <p><strong className="text-base">🔐 First Login:</strong></p>
            <p className="ml-6 text-xs">1. Go to login page</p>
            <p className="ml-6 text-xs">2. Enter your username and temporary password</p>
            <p className="ml-6 text-xs">3. You'll be asked to change your password</p>
            <p className="ml-6 text-xs">4. Your family tree will be auto-populated!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Card Component
const StepCard = ({ step }) => {
  const Icon = step.icon;
  const colorMap = {
    blue: 'from-blue-100 to-blue-50 border-blue-200 text-blue-900',
    orange: 'from-orange-100 to-orange-50 border-orange-200 text-orange-900',
    green: 'from-emerald-100 to-emerald-50 border-emerald-200 text-emerald-900',
  };

  return (
    <div className={`bg-gradient-to-r ${colorMap[step.color]} border-2 rounded-xl p-6`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${step.color}-400 to-${step.color}-600 flex items-center justify-center`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">Step {step.number}: {step.title}</h3>
              <p className="text-sm opacity-75">{step.description}</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-white/50 rounded-full">
              {step.duration}
            </span>
          </div>
          <div className="space-y-1">
            {step.details.map((detail, idx) => (
              <p key={idx} className="text-sm font-medium flex items-start gap-2">
                <span className="flex-shrink-0">{detail.split(':')[0]}</span>
                <span className="flex-1">{detail.split(':')[1]}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Data Box Component
const DataBox = ({ title, color, items }) => {
  const borderColorMap = {
    blue: 'border-blue-200',
    purple: 'border-purple-200',
    indigo: 'border-indigo-200',
    pink: 'border-pink-200',
    cyan: 'border-cyan-200',
  };

  return (
    <div className={`border-2 ${borderColorMap[color]} rounded-lg bg-white overflow-hidden`}>
      <div className={`bg-${color}-100 px-4 py-2 border-b border-${color}-200`}>
        <h4 className="font-bold text-sm text-gray-800">{title}</h4>
      </div>
      <div className="p-3 space-y-1 text-xs">
        {items.map((item, idx) => (
          <div key={idx} className={`flex justify-between py-1 px-2 rounded ${item.highlight ? 'bg-yellow-100 font-bold' : ''}`}>
            <span className="font-semibold text-gray-700">{item.label}:</span>
            <span className="text-gray-600 font-mono">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyTreeOnboardingVisual;