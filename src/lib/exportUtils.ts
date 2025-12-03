import { useSheetStore } from "@/store/useSheetStore";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export const downloadAsImage = async () => {
  const element = document.getElementById("rpg-sheet-canvas");
  const sheetName = useSheetStore.getState().sheetName ?? "character-sheet";

  if (!element) return;

  try {
    // 1. Generate image (pixelRatio == 2 to preserve quality)
    const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });

    // 2. Temporal link and force download
    const link = document.createElement("a");
    link.download = `${sheetName}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Error exporting image:", err);
  }
};

export const downloadAsPDF = async () => {
  const element = document.getElementById("rpg-sheet-canvas");
  const sheetName = useSheetStore.getState().sheetName ?? "character-sheet";

  if (!element) return;

  try {
    // 1. Generate image first
    const dataUrl = await toPng(element, { pixelRatio: 2 });

    // 2. Calc dimensions for PDF (A4)
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(dataUrl);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    // Calc proportional height to avoid deformation
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // 3. Add image to PDF
    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${sheetName}.pdf`);
  } catch (err) {
    console.error("Error exporting PDF:", err);
  }
};

const filter = (node: HTMLElement) => {
  // To exclude specific elements from the final image,
  // use a className 'no-export' and filter here.
  const exclusionClasses = ["react-grid-placeholder", "grid-drag-handle"];
  return !exclusionClasses.some((classname) => node.classList?.contains(classname));
};

// Use example:
// await toPng(element, {
//   pixelRatio: 2,
//   filter: filter,
//   backgroundColor: "#ffffff", // Force a white background just in case
// });
