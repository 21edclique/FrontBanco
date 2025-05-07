const amortizacion = require('./amortizacion.js');
const pdfBuilder = require('./pdf_generator/pdf_builder.js');

let [tabla, interesAcumulado] = amortizacion.calcularAmortizacion("f",0.14,12000,24,800);
console.log(interesAcumulado);
printTable(tabla);
pdfBuilder.generatePDF("PRECISO","ALEMÁN",14,12000,24,800, tabla, interesAcumulado);

function printTable(tabla){
    console.log('[ Mes, Cuota, Interés, Seguro, Capital, Saldo ]');
    tabla.forEach(row => {
        console.log(`[ ${row.mes}, ${Math.round(row.cuota * 100) / 100}, ${Math.round(row.interes * 100) / 100}, ${row.tasaSeguro}, ${Math.round(row.capital * 100) / 100}, ${Math.round(row.saldo * 100) / 100} ]`);
    });
}

const inversiones = require('./inversiones.js');
console.log(inversiones.calcularInversión(31,7000));