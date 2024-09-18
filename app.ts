// Import necessary types

// Define types for resume elements
interface ResumeElement {
  name: HTMLElement;
  email: HTMLElement;
  phone: HTMLElement;
  profilePic: HTMLElement;
  educationList: HTMLElement;
  workList: HTMLElement;
  skillsList: HTMLElement;
}

// Define types for input elements
interface InputElement {
  name: HTMLInputElement;
  email: HTMLInputElement;
  phone: HTMLInputElement;
  profilePicUrl: HTMLInputElement;
  profilePicUpload: HTMLInputElement;
  education: HTMLInputElement;
  workExperience: HTMLInputElement;
  skills: HTMLInputElement;
}

// Get resume form and input elements
const resumeForm: HTMLFormElement = document.getElementById(
  "resume-form"
) as HTMLFormElement;
const inputs: InputElement = {
  name: resumeForm.name as HTMLInputElement,
  email: resumeForm.email as HTMLInputElement,
  phone: resumeForm.phone as HTMLInputElement,
  profilePicUrl: resumeForm.profilePicUrl as HTMLInputElement,
  profilePicUpload: resumeForm.profilePicUpload as HTMLInputElement,
  education: resumeForm.education as HTMLInputElement,
  workExperience: resumeForm.workExperience as HTMLInputElement,
  skills: resumeForm.skills as HTMLInputElement,
};

// Get resume elements
const resumeElements: ResumeElement = {
  name: document.getElementById("res-name") as HTMLElement,
  email: document.getElementById("res-email") as HTMLElement,
  phone: document.getElementById("res-phone") as HTMLElement,
  profilePic: document.getElementById("res-profile-pic") as HTMLElement,
  educationList: document.getElementById("res-education-list") as HTMLElement,
  workList: document.getElementById("res-work-list") as HTMLElement,
  skillsList: document.getElementById("res-skills-list") as HTMLElement,
};

// Get resume container
const resumeContainer: HTMLElement = document.querySelector(
  ".resume-container"
) as HTMLElement;

// Define clearList function
function clearList(list: HTMLElement) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

// Add event listener to resume form
resumeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Check if all required fields are filled
  if (Object.values(inputs).every((input) => input.value.trim() !== "")) {
    // Update resume elements
    updateResumeElements();

    // Show resume container
    resumeContainer.style.display = "block";
  } else {
    alert("Please fill in all required fields.");
  }
});

// Define updateResumeElements function
function updateResumeElements() {
  Object.keys(resumeElements).forEach((key) => {
    const input = inputs[key];
    const element = resumeElements[key];

    switch (key) {
      case "profilePicUrl":
        element.src = input.value;
        element.style.display = "block";
        break;
      case "profilePicUpload":
        const reader = new FileReader();
        reader.onload = (event) => {
          element.src = event.target.result;
          element.style.display = "block";
        };
        reader.readAsDataURL(input.files[0]);
        break;
      case "education":
      case "workExperience":
      case "skills":
        const list = element;
        const array = input.value.split(",").map((item) => item.trim());
        array.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          list.appendChild(li);
        });
        break;
      default:
        element.textContent = input.value;
    }
  });
}

// Define saveEditedContent function
function saveEditedContent(element: HTMLElement, storageKey: string) {
  element.addEventListener("blur", () => {
    const newValue = element.textContent || "";
    localStorage.setItem(storageKey, newValue);
    element.textContent = newValue;
  });
}

// Save edited content
Object.keys(resumeElements).forEach((key) => {
  const element = resumeElements[key];
  saveEditedContent(element, key);
});

// Define loadStoredContent function
function loadStoredContent(element: HTMLElement, storageKey: string) {
  const storedValue = localStorage.getItem(storageKey);
  if (storedValue) {
    element.textContent = storedValue;
  }
}

// Load stored content
Object.keys(resumeElements).forEach((key) => {
  const element = resumeElements[key];
  loadStoredContent(element, key);
});

// Get share button
const shareBtn: HTMLElement = document.getElementById(
  "share-btn"
) as HTMLElement;

// Add event listener to share button
shareBtn.addEventListener("click", () => {
  const resumeContent = document.getElementById("generated-resume").outerHTML;
  const shareData = {
    title: "My Resume",
    text: "Check out my resume!",
    url: window.location.href,
  };
  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => console.log("Shared successfully"))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    console.log("Sharing not supported");
  }
});

// Get download button
const downloadBtn: HTMLElement = document.getElementById(
  "download-btn"
) as HTMLElement;

// Add event listener to download button
downloadBtn.addEventListener("click", () => {
  const resumeHTML = resumeContainer.innerHTML;
  const blob = new Blob([resumeHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.html";
  a.click();
});
