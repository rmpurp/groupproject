const echoSpan = document.getElementById("echo-span") as HTMLSpanElement;
const inputField = document.getElementById("input-field") as HTMLInputElement;

if (inputField) {
  inputField.addEventListener("input", (event) => {
    echoSpan.innerText = inputField.value;
  });
}
