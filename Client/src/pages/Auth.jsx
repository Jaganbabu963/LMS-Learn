import Commonform from "@/components/common-form/Commonform";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { signUpFormDetails, signInFormDetails } from "/config/index.js";
import { GraduationCap } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthContext } from "@/context/Auth-context";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormdata,
    setSignInFormdata,
    signUpFormdata,
    setSignUpFormdata,
    handleRegisteruser,
    handleloginUser,
  } = useContext(AuthContext);

  // console.log(signInFormdata);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (activeTab === "signin") {
      setSignInFormdata({}); // Reset formData for Sign In
    } else if (activeTab === "signup") {
      setSignUpFormdata({}); // Reset formData for Sign Up
    }
  }, [activeTab, setSignInFormdata, setSignUpFormdata]);
  function checkSignInEmptyField() {
    return (
      signInFormdata?.userEmail?.trim() !== "" &&
      signInFormdata?.Password?.trim() !== ""
    );
  }

  function checkSignUpEmptyField() {
    return (
      signUpFormdata &&
      signUpFormdata.name !== "" &&
      signInFormdata.userEmail !== "" &&
      signUpFormdata.Password !== "" &&
      signUpFormdata.ConfirmPassword !== ""
    );
  }
  // console.log(signUpFormdata);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl"> LMS Learn</span>
        </Link>
      </header>
      <div className="flex items-ccenter justify-center bg-background min-h-screen">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md m-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="p-3 space-y-2">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your Email and Password{" "}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Commonform
                  formControls={signInFormDetails}
                  butttonText={"Sign In"}
                  formData={signInFormdata}
                  setFormData={setSignInFormdata}
                  isButtonDisabled={!checkSignInEmptyField()}
                  handleSubmit={handleloginUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="p-3 space-y-2">
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a new Account </CardDescription>
              </CardHeader>
              <CardContent className=" space-y-4">
                <Commonform
                  formControls={signUpFormDetails}
                  butttonText={"Sign Up"}
                  formData={signUpFormdata}
                  setFormData={setSignUpFormdata}
                  isButtonDisabled={!checkSignUpEmptyField()}
                  handleSubmit={handleRegisteruser}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
