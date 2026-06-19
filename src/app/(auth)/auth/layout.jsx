import Navbar from "@/components/Navbar";

const AuthLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;
