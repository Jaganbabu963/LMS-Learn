/* eslint-disable react/prop-types */

import { Button } from "../ui/button";
import FormControls from "./FormControls";

const Commonform = ({
  handleSubmit,
  butttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button disabled={isButtonDisabled} type="submit">
        {butttonText || "Submit"}{" "}
      </Button>
    </form>
  );
};

export default Commonform;
