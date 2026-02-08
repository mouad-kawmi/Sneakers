

/**
 * Generates a clean Minimalist Luxury PDF invoice as shown in the reference image
 */
/**
 * Generates a clean Minimalist Luxury HTML invoice and triggers print
 */
export const generateOrderPdf = (order) => {
    // 1. Open a new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Veuillez autoriser les pop-ups pour télécharger la facture.");
        return;
    }

    // 2. Prepare data
    const date = new Date(order.date || new Date()).toLocaleDateString('fr-FR');
    const orderId = order.id || 'N/A';
    const customer = order.customer || {};
    const items = order.items || [];

    // Calculate subtotal if not present (though usually order.total is final)
    // Assuming order.total is the final amount to pay.
    const total = order.total || 0;

    // 3. Construct HTML
    const htmlContent = `
<!DOCTYPE html>
<html class="light" lang="fr">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Facture #${orderId} - Snadell</title>
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;family=Playfair+Display:wght@700&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography,container-queries"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        primary: "#c29f52",
                        "background-light": "#ffffff",
                        "background-dark": "#111111",
                        "cream-subtle": "#faf9f6",
                    },
                    fontFamily: {
                        display: ["'Playfair Display'", "serif"],
                        sans: ["'Inter'", "sans-serif"],
                    },
                    borderRadius: {
                        DEFAULT: "0.25rem",
                    },
                },
            },
        };
    </script>
    <style type="text/tailwindcss">
        @media print {
            .no-print {
                display: none !important;
            }
            body {
                background: white !important;
                color: black !important;
            }
            .invoice-container {
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
            }
        }
        
        .download-btn-hidden {
            display: none !important;
        }

        #invoice-wrapper {
            max-width: 800px;
            margin: 0 auto;
            background: white;
        }
    </style>
    <script>
        function downloadPdf() {
            const element = document.getElementById('invoice-wrapper');
            const button = document.getElementById('download-btn');
            const nav = document.getElementById('nav-controls');
            
            nav.classList.add('download-btn-hidden');
            
            const opt = {
                margin: 0,
                filename: 'Facture_Snadell_${orderId}.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                nav.classList.remove('download-btn-hidden');
            });
        }
    </script>
</head>
<body class="bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-slate-100 min-h-screen py-12 px-4">

    <!-- Print Controls -->
    <div id="nav-controls" class="max-w-4xl mx-auto mb-8 flex justify-between items-center no-print">
        <button id="download-btn" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors" onclick="downloadPdf()">
            <span class="material-symbols-outlined text-xl">download</span>
            <span class="text-sm font-medium">Télécharger le PDF</span>
        </button>
        <button class="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded shadow-sm" onclick="document.documentElement.classList.toggle('dark')">
            <span class="material-symbols-outlined block dark:hidden">dark_mode</span>
            <span class="material-symbols-outlined hidden dark:block">light_mode</span>
        </button>
    </div>

    <!-- Invoice Content -->
    <div id="invoice-wrapper" class="invoice-container max-w-4xl mx-auto bg-background-light dark:bg-background-dark border border-slate-200 dark:border-zinc-800 shadow-xl p-12 md:p-16 relative">
        
        <!-- Header -->
        <header class="flex flex-col md:flex-row justify-between items-start mb-16">
            <div>
                <h1 class="text-6xl md:text-7xl font-display uppercase tracking-tight mb-4">Facture</h1>
                <div class="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold tracking-widest uppercase border border-primary/20">
                    Officielle
                </div>
            </div>
            <div class="mt-8 md:mt-2 text-right">
                <p class="text-xs font-bold text-slate-400 dark:text-zinc-500 tracking-widest uppercase mb-1">Date d'émission</p>
                <p class="text-lg font-medium">${date}</p>
                <p class="text-xs text-slate-400 mt-2">N° ${orderId}</p>
            </div>
        </header>

        <!-- Billing & Payment Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
                <h3 class="text-xs font-bold text-primary tracking-[0.2em] uppercase mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
                    Destinataire (Bill To)
                </h3>
                <div class="space-y-1">
                    <p class="text-xl font-bold mb-2 uppercase">${customer.fullName || 'Client'}</p>
                    <p class="text-slate-600 dark:text-zinc-400">${customer.address || ''}</p>
                    <p class="text-slate-600 dark:text-zinc-400">${customer.city || ''}${customer.postalCode ? ', ' + customer.postalCode : ''}, Maroc</p>
                    <div class="flex items-center gap-2 text-slate-500 dark:text-zinc-500 mt-3">
                        <span class="material-symbols-outlined text-sm">call</span>
                        <span class="text-sm">${customer.phone || 'N/A'}</span>
                    </div>
                    ${customer.email ? `
                    <div class="flex items-center gap-2 text-slate-500 dark:text-zinc-500">
                        <span class="material-symbols-outlined text-sm">mail</span>
                        <span class="text-sm">${customer.email}</span>
                    </div>` : ''}
                </div>
            </div>
            <div>
                <h3 class="text-xs font-bold text-primary tracking-[0.2em] uppercase mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
                    Paiement
                </h3>
                <div class="space-y-2">
                    <p class="text-xl font-bold uppercase tracking-tight">
                        ${order.paymentMethod === 'cod' ? 'À la livraison (COD)' :
            order.paymentMethod === 'card' ? 'Carte Bancaire' :
                order.paymentMethod === 'paypal' ? 'PayPal' : order.paymentMethod}
                    </p>
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                        <p class="text-sm text-slate-600 dark:text-zinc-400">Statut du paiement: <span class="font-medium">En attente</span></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <div class="mb-8 overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-zinc-950 dark:bg-zinc-900 text-primary text-[10px] font-bold tracking-[0.2em] uppercase">
                        <th class="py-4 px-6 border-r border-zinc-800">Modèle</th>
                        <th class="py-4 px-6 border-r border-zinc-800 text-center">Taille</th>
                        <th class="py-4 px-6 border-r border-zinc-800 text-center">Qté</th>
                        <th class="py-4 px-6 border-r border-zinc-800 text-right">Prix Unitaire</th>
                        <th class="py-4 px-6 text-right">Montant Total</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-zinc-800">
                    ${items.map(item => `
                    <tr class="group">
                        <td class="py-6 px-6">
                            <div class="font-bold text-slate-900 dark:text-white uppercase tracking-tight">${item.name || 'Produit'}</div>
                            ${item.ref ? `<div class="text-[10px] text-slate-400 uppercase mt-1">Ref: ${item.ref}</div>` : ''}
                        </td>
                        <td class="py-6 px-6 text-center text-slate-600 dark:text-zinc-400">${item.size || '-'}</td>
                        <td class="py-6 px-6 text-center text-slate-600 dark:text-zinc-400">${item.quantity || 1}</td>
                        <td class="py-6 px-6 text-right text-slate-600 dark:text-zinc-400">${item.price || 0} DH</td>
                        <td class="py-6 px-6 text-right font-medium text-slate-900 dark:text-white">${(item.price || 0) * (item.quantity || 1)} DH</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Totals -->
        <div class="flex flex-col items-end">
            <div class="w-full md:w-80">
                <div class="space-y-3 mb-6">
                    <div class="flex justify-between text-xs px-6">
                        <span class="text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Sous-total</span>
                        <span class="text-slate-600 dark:text-zinc-400 font-medium">${total} DH</span>
                    </div>
                    <div class="flex justify-between text-xs px-6">
                        <span class="text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Livraison</span>
                        <span class="text-slate-600 dark:text-zinc-400 font-medium">Gratuite</span>
                    </div>
                    <div class="flex justify-between text-xs px-6">
                        <span class="text-slate-400 dark:text-zinc-500 uppercase tracking-widest">TVA (0%)</span>
                        <span class="text-slate-600 dark:text-zinc-400 font-medium">0 DH</span>
                    </div>
                </div>
                <div class="border border-zinc-800 dark:border-zinc-700 bg-cream-subtle dark:bg-zinc-900/40 p-5 flex justify-between items-center">
                    <span class="text-[10px] font-light tracking-[0.25em] uppercase text-zinc-500 dark:text-zinc-400">Total à Payer</span>
                    <span class="text-base font-semibold text-zinc-900 dark:text-white">${total} DH</span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="mt-24 pt-8 border-t border-slate-100 dark:border-zinc-800">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <p class="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Conditions de retour</p>
                    <p class="text-[11px] text-slate-500 dark:text-zinc-500 max-w-sm">Les articles peuvent être retournés dans un délai de 7 jours dans leur emballage d'origine. Merci de votre confiance.</p>
                </div>
                <div class="flex gap-4">
                    <div class="w-10 h-10 rounded bg-slate-50 dark:bg-zinc-900 flex items-center justify-center border border-slate-200 dark:border-zinc-800">
                        <span class="material-symbols-outlined text-slate-400">qr_code_2</span>
                    </div>
                </div>
            </div>
        </footer>
    </div>
    
    <!-- Decorative top striped -->
    <div class="fixed top-0 left-0 w-full h-1 bg-primary no-print"></div>

</body>
</html>
    `;

    // 4. Write to window & print
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Slight delay to ensure styles are loaded or document is ready
    // You might also use an onload event on the window, but setTimeout is often simpler for dynamic content.
    // However, since we are using CDN scripts, we should wait for load.

    printWindow.onload = () => {
        // Auto-download not recommended as it might be blocked or too fast before fonts load.
        // User triggers it manually.
    };
};

