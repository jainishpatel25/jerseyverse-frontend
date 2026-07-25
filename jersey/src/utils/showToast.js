import { Toast } from 'bootstrap';
export default function showToast(message, type = 'success') {
  const toast = document.getElementById('customToast');
  const toastMessage = document.getElementById('toastMessage');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;

  // Update color class based on type
  toast.className = `toast align-items-center text-bg-${type} border-0`;

 const toastInstance = new Toast(toast); // ✅ use Toast class
  toastInstance.show();
}

//Worked on real-world software projects using the MERN stack, focusing on both front-end and back-end development. Collaborated with the development team to build and optimize scalable web applications. Gained practical experience in API integration, database management, and Agile workflows.