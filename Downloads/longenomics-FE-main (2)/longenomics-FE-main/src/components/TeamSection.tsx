import React from 'react';
import './TeamSection.css';
import profileImage from '../assets/profile.jpg';

// 1. Define an interface for the props of TeamMemberCard
interface TeamMemberCardProps {
  name: string;
  title: string;
  isLarge?: boolean; // '?' makes it optional
}

// Helper function to generate a stable, unique ID for a string
const stringToUniqueId = (str: string): number => { // Added type for 'str' and return type
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash % 1000); // Use modulo to keep it within picsum.photos ID range (0-1000 roughly)
};

// 2. Use the interface in your component's function signature
const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ name, title, isLarge = false }) => {
  const stableRandomId = stringToUniqueId(name);

  const largeImageUrl = `https://picsum.photos/id/${stableRandomId}/300/300`;
  const smallImageUrl = `https://picsum.photos/id/${stableRandomId}/200/200`;

  const fallbackLargePlaceholder = `https://placehold.co/300x300/2a2a2a/ffffff?text=${encodeURIComponent(name.replace(' ', '+'))}+Large`;
  const fallbackSmallPlaceholder = `https://placehold.co/200x200/2a2a2a/ffffff?text=${encodeURIComponent(name.replace(' ', '+'))}+Small`;

  // const finalImageUrl = isLarge ? largeImageUrl : smallImageUrl;
  const finalImageUrl = profileImage;
  const onErrorFallback = isLarge ? fallbackLargePlaceholder : fallbackSmallPlaceholder;

  return (
    <div className={`team-member-card ${isLarge ? 'large-card' : 'small-card'}`}>
      <img
        src={finalImageUrl}
        alt={name}
        className="team-member-image"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = onErrorFallback;
        }}
      />
      <div className="team-member-overlay"></div>
      <div className="team-member-info">
        <h3 className="team-member-name">{name}</h3>
        <p className="team-member-title">{title}</p>
      </div>
    </div>
  );
};

// 3. (Optional but good practice) Define an interface for the team member objects
interface TeamMember {
  name: string;
  title: string;
  large?: boolean;
}

const TeamSection: React.FC = () => { // Type for TeamSection
  const teamMembers: TeamMember[] = [ // Explicitly type the array
    { name: 'Soumik Ghosh', title: 'Founder', large: true },
    // { name: 'Vittorio Cegliano', title: 'CTO', large: true },
    // { name: 'Vittoria La Barbera', title: 'PhD, CSO' },
    // { name: 'Pierre Schumacher', title: 'PhD, Head of Research' },
    // { name: 'Isaac Zuabi', title: 'PhD, Head of AI' },
    // { name: 'Yufei Zhang', title: 'PhD' },
    // { name: 'Bruno Laurenza', title: 'CTO (Ex-Meta/Google)' },
    // { name: 'Haizhou Zeng', title: 'PhD, AI Scientist' },
    // { name: 'Andrea Previtera', title: 'PhD' },
    // { name: 'Edoardo Bartocci', title: 'PhD, AI Scientist' },
    // { name: 'Yogeshwari Babar', title: 'Research Engineer' },
    // { name: 'Daein Asifash', title: 'Research Engineer' },
    // { name: 'Eliy Hernández', title: 'MS, Operations' },
    // { name: 'Bradley Alx', title: 'MBA, Business' },
  ];

  return (
    <div className="team-section-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>

      <div className="team-section-header">
        <h1 className="team-section-title">Meet Our Team</h1>
        <p className="team-section-description">
          The minds behind Longenomics' embodied intelligence revolution.
        </p>
      </div>

      <div className="team-members-grid-container">
        <div className="team-members-row large-members-row">
          {teamMembers.slice(0, 2).map((member) => (
            <TeamMemberCard key={member.name} {...member} isLarge={true} />
          ))}
        </div>

        <div className="team-members-grid">
          {teamMembers.slice(2).map((member) => (
            <TeamMemberCard key={member.name} {...member} />
          ))}
        </div>
      </div>

      <div className="team-section-footer">
        <p className="footer-intro">We are supported and championed by:</p>
        <p className="footer-names">
          Multiple PhDs, AI scientists, Doctors and industry veterans.
        </p>
      </div>
    </div>
  );
};

export default TeamSection;