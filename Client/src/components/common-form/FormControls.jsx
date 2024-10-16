import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

/* eslint-disable react/prop-types */

const FormControls = ({ formControls = [], formData, setFormData }) => {
  function renderComponentbyType(getControlitem) {
    let element = null;
    const currentControlledValue = formData[getControlitem.name] || "";
    switch (getControlitem.componentType) {
      case "input":
        element = (
          <Input
            id={getControlitem.name}
            name={getControlitem.name}
            placeholder={getControlitem.placeholder}
            type={getControlitem.type}
            value={currentControlledValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlitem.name]: event.target.value,
              })
            }
          />
        );
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlitem.name]: value,
              })
            }
            value={currentControlledValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlitem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlitem.options && getControlitem.options.length > 0
                ? getControlitem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            id={getControlitem.name}
            name={getControlitem.name}
            placeholder={getControlitem.placeholder}
            type={getControlitem.type}
            value={currentControlledValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlitem.name]: event.target.value,
              })
            }
          />
        );
        break;
      default:
        element = (
          <Input
            id={getControlitem.name}
            name={getControlitem.name}
            placeholder={getControlitem.placeholder}
            type={getControlitem.type}
            value={currentControlledValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlitem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }
    return element;
  }
  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controlItem) => (
        <div key={controlItem.name}>
          <label htmlFor={controlItem.label}>{controlItem.label}</label>
          {renderComponentbyType(controlItem)}
        </div>
      ))}
    </div>
  );
};

export default FormControls;
