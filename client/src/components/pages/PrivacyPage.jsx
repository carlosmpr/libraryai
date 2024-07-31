// components/pages/PrivacyPage.jsx
import Feature from '../ui/Feature';

const PrivacyPage = ({ content }) => {
  return (
    <Feature title={content.title} description={content.description}>
      <div className="text-left max-w-2xl mx-auto space-y-4">
        {content.sections.map((section, index) => (
          <div key={index}>
            {section.title && <h3 className="text-xl font-semibold">{section.title}</h3>}
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </Feature>
  );
};

export default PrivacyPage;
