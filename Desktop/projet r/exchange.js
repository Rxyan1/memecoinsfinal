document.addEventListener('DOMContentLoaded', function() {
    const exchangeForm = document.getElementById('exchange-form');
    const fromSelect = document.getElementById('exchange-from');
    const toSelect = document.getElementById('exchange-to');
    const amountFrom = document.getElementById('amount-from');
    const amountTo = document.getElementById('amount-to');
    const currentRate = document.getElementById('current-rate');
    
    // Taux de change (à obtenir depuis votre API en production)
    const rate = parseFloat(currentRate.textContent);
    
    // Fonction pour calculer le montant de conversion
    function calculateExchange() {
        const amount = parseFloat(amountFrom.value) || 0;
        let result = 0;
        
        if (fromSelect.value === 'zth' && toSelect.value === 'psp') {
            result = amount / rate;
        } else if (fromSelect.value === 'psp' && toSelect.value === 'zth') {
            result = amount * rate;
        }
        
        amountTo.value = result.toFixed(4);
    }
    
    // Écouter les changements dans le formulaire
    amountFrom.addEventListener('input', calculateExchange);
    fromSelect.addEventListener('change', function() {
        // Si les deux sélecteurs ont la même valeur, changer l'autre
        if (fromSelect.value === toSelect.value) {
            toSelect.value = fromSelect.value === 'zth' ? 'psp' : 'zth';
        }
        calculateExchange();
    });
    
    toSelect.addEventListener('change', function() {
        // Si les deux sélecteurs ont la même valeur, changer l'autre
        if (toSelect.value === fromSelect.value) {
            fromSelect.value = toSelect.value === 'zth' ? 'psp' : 'zth';
        }
        calculateExchange();
    });
    
    // Soumettre le formulaire
    exchangeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const amount = parseFloat(amountFrom.value);
        const fromCurrency = fromSelect.value.toUpperCase();
        const toCurrency = toSelect.value.toUpperCase();
        const calculatedAmount = parseFloat(amountTo.value);
        
        if (amount <= 0) {
            alert('Veuillez entrer un montant valide.');
            return;
        }
        
        // Ici, vous feriez un appel API pour effectuer l'échange
        console.log(`Échange: ${amount} ${fromCurrency} → ${calculatedAmount} ${toCurrency}`);
        
        // Simulation de réussite
        alert(`Échange réussi: ${amount} ${fromCurrency} → ${calculatedAmount.toFixed(4)} ${toCurrency}`);
        
        // Ajouter à l'historique
        addToHistory(amount, fromCurrency, calculatedAmount, toCurrency);
        
        // Réinitialiser le formulaire
        amountFrom.value = '';
        amountTo.value = '';
    });
    
    // Fonction pour ajouter une transaction à l'historique
    function addToHistory(fromAmount, fromCurrency, toAmount, toCurrency) {
        const historyTable = document.getElementById('history-table-body');
        const now = new Date();
        const dateString = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dateString}</td>
            <td>${fromAmount} ${fromCurrency}</td>
            <td>${toAmount.toFixed(4)} ${toCurrency}</td>
            <td>${rate}</td>
        `;
        
        historyTable.prepend(row);
    }
});
