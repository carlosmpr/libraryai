// components/pages/PrivacyPage.jsx
import Feature from '../ui/Feature';
import { useLocalization } from '../context/LocalizationContext';
const PrivacyPage = () => {
  const { privacyPolicyPageData } = useLocalization();
  return (
    <Feature title={privacyPolicyPageData.title} description={privacyPolicyPageData.description}>
      <div className="text-left max-w-2xl mx-auto space-y-4">
        {privacyPolicyPageData.sections.map((section, index) => (
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
