import Image from "next/image";
import RegisterForm from "./_components/RegisterForm";

const page = () => {
  return (
    <>
      <div className="h-screen w-screen flex">
        {/* <!-- Left Half: Illustration --> */}
        <div className="w-1/2 flex items-center justify-center">
          <Image
            src="https://i.ibb.co/q3x8dTqf/register-illustration.png"
            alt="Login Illustration"
            className="w-full px-6"
            width={1000}
            height={1000}
            priority
          />
        </div>

        {/* <!-- Right Half: Sign Up Form --> */}
        <div className="w-1/2 bg-[#f4f4fc] flex items-center justify-center">
          <RegisterForm />
        </div>
      </div>
    </>
  );
};

export default page;
