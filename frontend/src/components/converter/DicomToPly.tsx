import { PythonShell } from "python-shell";

// PythonShell.runString("x=1+1;print(x)", undefined).then((messages) => {
//   console.log("finished");
// });
// console.log(PythonShell);

const ConvertDICOMToPLY = () => {
  return (
    <div className="py-10 text-center">
      <button className="w-20 bg-slate-200">Convert</button>
    </div>
  );
};

export default ConvertDICOMToPLY;
