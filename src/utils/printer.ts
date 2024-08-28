export const printContent = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const content = element.innerHTML;

  const printWindow = window.open("", "", "height=600,width=800,toolbar=1");
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(
    `<html>
        <head>
            <title>${elementId}</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table {
                    width: 100%;
                } 
                tr {
                    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
                    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
                    transition-duration: .15s;
                    border-bottom-width: 1px;
                }
                th {
                    height: 3rem;
                    padding-left: 1rem;
                    padding-right: 1rem;
                    text-align: left;
                    vertical-align: middle;
                    font-weight: 500;
                }
                td {
                    padding: 1rem;
                    vertical-align: middle;
                }
                svg {
                    width: 1.5rem;
                    height: 1.5rem;
                    border-radius: .25rem;
                    padding: .25rem;
                }
            </style>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>${content}</body>
    </html>`
  );

  printWindow.document.close();

  printWindow.focus();
  printWindow.print();

  printWindow.onafterprint = () => {
    printWindow.close();
  };
};
