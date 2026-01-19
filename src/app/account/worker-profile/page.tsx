'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X } from 'lucide-react';

const skillOptions = [
  'Combine Operation',
  'Swather Operation',
  'Tractor Operation',
  'Sprayer Operation',
  'Seeding Equipment',
  'Cattle Handling',
  'Horse Training',
  'Livestock General',
  'Fencing',
  'Welding',
  'Equipment Maintenance',
  'Irrigation',
  'Grain Handling',
  'Truck Driving',
  'Farm Management',
  'Bookkeeping',
];

const certificationOptions = [
  'Class 1 License',
  'Class 3 License',
  'Class 5 License',
  'First Aid',
  'H2S Alive',
  'WHMIS',
  'Pesticide Applicator',
  'AI Technician',
  'Animal Health Certificate',
];

export default function WorkerProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    experience_years: '',
    availability: '',
    has_transportation: false,
    has_drivers_license: false,
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const toggleCertification = (cert: string) => {
    if (certifications.includes(cert)) {
      setCertifications(certifications.filter((c) => c !== cert));
    } else {
      setCertifications([...certifications, cert]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        ...formData,
        skills,
        certifications,
        experience_years: parseInt(formData.experience_years) || 0,
      };
      console.log('Worker profile:', profileData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/account');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Account
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold text-foreground mb-2">Worker Profile</h1>
        <p className="text-muted mb-6">
          Create your worker profile so farmers can find and hire you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="label">About You *</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              placeholder="Introduce yourself - your background, what kind of work you're looking for, what makes you a great hire..."
              required
              className="input"
            />
          </div>

          {/* Experience and Availability */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="experience_years" className="label">Years of Experience *</label>
              <input
                id="experience_years"
                name="experience_years"
                type="number"
                min="0"
                max="50"
                value={formData.experience_years}
                onChange={handleChange}
                placeholder="e.g., 5"
                required
                className="input"
              />
            </div>
            <div>
              <label htmlFor="availability" className="label">Availability *</label>
              <input
                id="availability"
                name="availability"
                type="text"
                value={formData.availability}
                onChange={handleChange}
                placeholder="e.g., May - October 2025"
                required
                className="input"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="has_transportation"
                checked={formData.has_transportation}
                onChange={handleChange}
                className="rounded border-border w-5 h-5"
              />
              <span>I have my own transportation</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="has_drivers_license"
                checked={formData.has_drivers_license}
                onChange={handleChange}
                className="rounded border-border w-5 h-5"
              />
              <span>I have a valid driver&apos;s license</span>
            </label>
          </div>

          {/* Skills */}
          <div>
            <label className="label">Skills *</label>
            <p className="text-sm text-muted mb-3">Select all that apply</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    skills.includes(skill)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-muted border-border hover:border-primary'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {/* Custom skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill"
                className="input flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="btn-outline"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {/* Selected custom skills */}
            {skills.filter((s) => !skillOptions.includes(s)).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills
                  .filter((s) => !skillOptions.includes(s))
                  .map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-sm bg-primary text-white flex items-center gap-1"
                    >
                      {skill}
                      <button type="button" onClick={() => toggleSkill(skill)}>
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Certifications */}
          <div>
            <label className="label">Certifications</label>
            <p className="text-sm text-muted mb-3">Select any certifications you hold</p>
            <div className="flex flex-wrap gap-2">
              {certificationOptions.map((cert) => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleCertification(cert)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    certifications.includes(cert)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-muted border-border hover:border-green-600'
                  }`}
                >
                  {cert}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted">
              Your profile will be visible to farmers
            </p>
            <div className="flex gap-3">
              <Link href="/account" className="btn-outline">Cancel</Link>
              <button
                type="submit"
                disabled={loading || skills.length === 0}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
