import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from './ui'; // Assuming ShadCN UI components
import { format } from 'date-fns';
import { getUserById, updateUser, UserInfo, UserCreation, URol, IdType } from './users';
import { createRequest, RequestCreation } from './requests';

// Define the form data type
type ProfileFormData = {
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  phone_number: string;
  country_code: string;
  identification_number: string;
  identification_type: IdType;
  justification?: string; // Included only for non-admins
};

// Props for ProfileComponent
interface ProfileComponentProps {
  userId: string;
  userRol: URol;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ userId, userRol }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // For admins
  const [isRequesting, setIsRequesting] = useState(false); // For non-admins

  // Fetch user data on mount or when userId changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  // Handle profile update for admins
  const handleUpdate = async (data: ProfileFormData) => {
    try {
      const updateData: UserCreation = {
        ...data,
        password: '', // Assuming empty password means no change; adjust if API requires otherwise
      };
      await updateUser(updateData, userId);
      const updatedUser = await getUserById(userId);
      setUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update profile');
    }
  };

  // Handle request creation for non-admins
  const handleRequest = async (data: ProfileFormData) => {
    if (!user) return;

    // Identify changed fields
    const proposedChanges: Partial<ProfileFormData> = {};
    for (const key in data) {
      if (key !== 'justification' && data[key as keyof ProfileFormData] !== user[key as keyof UserInfo]) {
        proposedChanges[key as keyof ProfileFormData] = data[key as keyof ProfileFormData];
      }
    }

    if (Object.keys(proposedChanges).length === 0) {
      alert('No changes proposed');
      return;
    }

    // Structure the justification with proposed changes and reason
    const justificationData = {
      proposed_changes: proposedChanges,
      reason: data.justification || 'No justification provided',
    };

    const request: RequestCreation = {
      requester_id: userId,
      requested_command: 'Update Profile',
      justification: JSON.stringify(justificationData),
    };

    try {
      await createRequest(request);
      setIsRequesting(false);
      alert('Update request submitted successfully');
    } catch (error) {
      console.error('Request submission failed', error);
      alert('Failed to submit update request');
    }
  };

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>{error}</div>;
  }

  // User not found
  if (!user) {
    return <div>User not found</div>;
  }

  // Editing mode for admins
  if (isEditing) {
    return <ProfileForm user={user} onSubmit={handleUpdate} includeJustification={false} />;
  }

  // Requesting mode for non-admins
  if (isRequesting) {
    return <ProfileForm user={user} onSubmit={handleRequest} includeJustification={true} />;
  }

  // Read-only profile view
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {user.first_name} {user.last_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4">
            <h3 className="font-semibold">Personal Information</h3>
            <p>First Name: {user.first_name}</p>
            <p>Last Name: {user.last_name}</p>
            <p>Birth Date: {format(new Date(user.birth_date), 'MMMM d, yyyy')}</p>
            <p>Identification Type: {user.identification_type}</p>
            <p>Identification Number: {user.identification_number}</p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold">Contact Information</h3>
            <p>Email: {user.email}</p>
            <p>Phone Number: {user.phone_number}</p>
            <p>Country Code: {user.country_code}</p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold">Account Information</h3>
            <p>Registration Date: {format(new Date(user.registration_date), 'MMMM d, yyyy HH:mm:ss')}</p>
            <p>User Role: {user.user_rol}</p>
          </div>
        </div>
        <div className="mt-4">
          {userRol === URol.ADMIN && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
          {userRol !== URol.ADMIN && (
            <Button onClick={() => setIsRequesting(true)}>Request Update</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ProfileForm component
interface ProfileFormProps {
  user: UserInfo;
  onSubmit: (data: ProfileFormData) => void;
  includeJustification: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSubmit, includeJustification }) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: user.first_name,
    last_name: user.last_name,
    birth_date: user.birth_date,
    email: user.email,
    phone_number: user.phone_number,
    country_code: user.country_code,
    identification_number: user.identification_number,
    identification_type: user.identification_type,
    justification: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">First Name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>
      <div>
        <label className="block">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>
      <div>
        <label className="block">Birth Date</label>
        <input
          type="date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>
      <div>
        <label className="block">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>
      <div>
        <label className="block">Phone Number</label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>
      <div>
        <label className="block">Country Code</label>
        <input
          type="text"
          name="country_code"
          value={formData.country_code}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>
      <div>
        <label className="block">Identification Number</label>
        <input
          type="text"
          name="identification_number"
          value={formData.identification_number}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>
      <div>
        <label className="block">Identification Type</label>
        <select
          name="identification_type"
          value={formData.identification_type}
          onChange={handleChange}
          className="w-full border p-2"
        >
          {Object.values(IdType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      {includeJustification && (
        <div>
          <label className="block">Justification</label>
          <textarea
            name="justification"
            value={formData.justification}
            onChange={handleChange}
            className="w-full border p-2"
            rows={4}
            placeholder="Explain why you need these changes"
          />
        </div>
      )}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default ProfileComponent;
