const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "johnpaulouma-mbasro@volunteerswithoutborders-kenya.org";

const form = document.querySelector("#leaseInquiryForm");
const statusMessage = document.querySelector("#formStatus");

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function buildEmailBody(data) {
  const rows = [
    ["Full name", data.get("fullName")],
    ["Phone or WhatsApp", data.get("phone")],
    ["Email", data.get("email")],
    ["Inquiry type", data.get("inquiryType")],
    ["Preferred parcel", data.get("preferredParcel")],
    ["Land size needed or offered", data.get("landSize")],
    ["Preferred start date", data.get("startDate") || "Not provided"],
    ["Lease term preference", data.get("termPreference")],
    ["Water access", data.get("waterAccess")],
    ["Budget or expected rent", data.get("budget") || "Not provided"],
    ["Location, reference, or directions", data.get("locationDetails") || "Not provided"],
    ["Additional notes", data.get("notes") || "Not provided"]
  ];

  return rows.map(([label, value]) => `${label}: ${value}`).join("\n");
}

async function submitToEndpoint(data) {
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(Object.fromEntries(data.entries()))
  });

  if (!response.ok) {
    throw new Error("The form endpoint did not accept the inquiry.");
  }
}

if (form && statusMessage) {
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("");

  if (!form.checkValidity()) {
    form.reportValidity();
    setStatus("Please complete the required fields before sending.", true);
    return;
  }

  const data = new FormData(form);
  const subject = encodeURIComponent("Avocado land lease inquiry");
  const body = encodeURIComponent(buildEmailBody(data));

  if (!FORM_ENDPOINT) {
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("Your email app is opening with the inquiry details.");
    return;
  }

  try {
    setStatus("Sending inquiry...");
    await submitToEndpoint(data);
    form.reset();
    setStatus("Inquiry sent. Thank you.");
  } catch (error) {
    setStatus("The inquiry could not be sent. Please try again or contact the team directly.", true);
  }
});
}
