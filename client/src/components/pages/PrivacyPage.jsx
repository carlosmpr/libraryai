import Feature from '../ui/Feature';

export const PrivacyPage = () => {
  return (
    <Feature title={"Privacy Policy"} description={"At Code Library, we take your privacy seriously. This policy outlines what information we collect and how we use it."}>
      <div className="text-left max-w-2xl mx-auto space-y-4">
       
        <h3 className="text-xl font-semibold">No User Data Collection</h3>
        <p>
          We do not collect any user data. This includes but is not limited to your personal information, login credentials, code, or any other data.
        </p>
        <h3 className="text-xl font-semibold">GitHub Login</h3>
        <p>
          We request your GitHub login solely to manage and create public repositories on your behalf. We do not access any of your private repositories or organization repositories. Additionally, we do not perform any actions to delete repositories.
        </p>
        <h3 className="text-xl font-semibold">Public Repository Management</h3>
        <p>
          Our application only interacts with public repositories. This ensures that your private code remains secure and inaccessible to our platform.
        </p>
        <h3 className="text-xl font-semibold">No Logging of Information</h3>
        <p>
          We do not log any information related to your login or code. Our system is designed to operate without storing or tracking your data.
        </p>
        <h3 className="text-xl font-semibold">Security</h3>
        <p>
          We are committed to ensuring that your information is secure. Although we do not collect or store your data, we use secure methods to interact with GitHub, ensuring that your login credentials and repositories are managed safely.
        </p>
        <h3 className="text-xl font-semibold">Changes to this Policy</h3>
        <p>
          We may update this privacy policy from time to time. Any changes will be posted on this page, and we encourage you to review our policy periodically.
        </p>
        <p>
          By using Code Library, you agree to this privacy policy. If you have any questions or concerns, please contact us.
        </p>
      </div>
    </Feature>
  );
};

export default PrivacyPage;
