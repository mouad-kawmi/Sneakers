import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a clean Minimalist Luxury PDF invoice as shown in the reference image
 */
export const generateOrderPdf = (order) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // --- COLOR PALETTE ---
    const colors = {
        primary: [17, 17, 17],     // Noir (#111111)
        gold: [201, 162, 77],      // Gold (#C9A24D)
        textGray: [120, 120, 120], // Secondary Text
        lightGray: [245, 245, 245],
        white: [255, 255, 255]
    };

    const margin = 15;
    const pageWidth = 210;

    // --- 1. HEADER SECTION ---
    doc.setTextColor(...colors.primary);
    doc.setFont('times', 'bold');
    doc.setFontSize(48);
    doc.text('FACTURE', margin, 35);

    // Date Emission
    doc.setTextColor(...colors.textGray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`DATE D'ÉMISSION: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - margin, 33, { align: 'right' });

    // "OFFICIELLE" Badge
    doc.setFillColor(...colors.gold);
    doc.roundedRect(margin, 42, 35, 7, 1, 1, 'F');
    doc.setTextColor(...colors.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('OFFICIELLE', margin + 17.5, 46.5, { align: 'center' });

    // --- 2. DESTINATAIRE & PAIEMENT ---
    const topY = 75;

    // Column 1: DESTINATAIRE
    doc.setTextColor(...colors.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('DESTINATAIRE (BILL TO)', margin, topY, { charSpace: 1 });

    doc.setTextColor(...colors.primary);
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    const clientName = (order.customer.fullName || order.customer.name || 'Client').toUpperCase();
    doc.text(clientName, margin, topY + 10);

    doc.setTextColor(...colors.textGray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const addrLines = [
        order.customer.address || 'N/A',
        `${order.customer.city || 'N/A'}, Maroc`,
        `Tél: ${order.customer.phone || 'N/A'}`,
        `Email: ${order.customer.email || 'N/A'}`
    ];
    doc.text(addrLines, margin, topY + 18, { lineHeightFactor: 1.4 });

    // Column 2: PAIEMENT
    const col2X = pageWidth / 2 + 10;
    doc.setTextColor(...colors.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('PAIEMENT', col2X, topY, { charSpace: 1 });

    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('À LA LIVRAISON (COD)', col2X, topY + 10);

    doc.setTextColor(...colors.textGray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Statut du paiement: En attente', col2X, topY + 18);

    // --- 3. PRODUCTS TABLE ---
    const tableData = order.items.map(item => [
        item.name.toUpperCase(),
        item.size,
        item.quantity,
        `${item.price} DH`,
        `${item.price * item.quantity} DH`
    ]);

    autoTable(doc, {
        startY: 125,
        head: [['SNEAKER / MODÈLE', 'TAILLE', 'QTÉ', 'PRIX UNITAIRE', 'MONTANT TOTAL']],
        body: tableData,
        margin: { left: margin, right: margin },
        theme: 'plain',
        styles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 8,
            textColor: [17, 17, 17],
            valign: 'middle'
        },
        headStyles: {
            fillColor: [17, 17, 17], // Solid Black header
            textColor: colors.gold,  // Gold Text in header
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 8,
            charSpace: 0.5
        },
        columnStyles: {
            0: { cellWidth: 'auto', fontStyle: 'bold' },
            1: { halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center', fontStyle: 'bold' }
        },
        alternateRowStyles: {
            fillColor: [252, 252, 252]
        }
    });

    // --- 4. TOTAL BOX ---
    const finalY = doc.lastAutoTable.finalY + 20;
    const boxWidth = 80;
    const boxHeight = 18;
    const boxX = pageWidth - margin - boxWidth;

    doc.setFillColor(...colors.gold);
    doc.rect(boxX, finalY, boxWidth, boxHeight, 'F');

    doc.setTextColor(...colors.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTAL À PAYER', boxX + 6, finalY + 11, { charSpace: 1 });

    doc.setFontSize(18);
    doc.text(`${order.total} DH`, boxX + boxWidth - 6, finalY + 11.5, { align: 'right' });

    // --- 5. FOOTER ---
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(7);
    doc.text('Cette facture est générée électroniquement par SBERDILA STORE.', pageWidth / 2, 285, { align: 'center' });

    doc.save(`Facture_Sberdila_${order.id}.pdf`);
};

