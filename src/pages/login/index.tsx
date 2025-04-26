import { AuthPage } from "@refinedev/mui";
import { k } from "../../common/constants";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      forgotPasswordLink={false}
      formProps={{
        defaultValues: { email: "admin@horizontech.com.hk", password: "admin" },
      }}
      registerLink={false}
      renderContent={(content: React.ReactNode, title: React.ReactNode) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {title}
            <img style={{ maxWidth: 352, marginBottom: 26 }} src="/admin/fosslogo_1.png" />
            {content}
          </div>
        );
      }}
    />
  );
};
