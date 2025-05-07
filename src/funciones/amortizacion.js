// src/funciones/amortizacion.js
exports.calcularAmortizacion = (sistema, tasaAnual, monto, periodoMeses, seguro = 0) => {
    let tabla = [];
    const getInteresAcumulado = getAcumuladorInteres();
    if(sistema == 'f'){
        tabla = sistemaFrances(tasaAnual, monto, periodoMeses, seguro, getInteresAcumulado);
    } else if( sistema == 'a'){
        tabla = sistemaAleman(tasaAnual, monto, periodoMeses, seguro, getInteresAcumulado);
    }
    return [tabla, formatNumber(getInteresAcumulado())];
}

function formatNumber(decimalNumber){
    return (Math.round(decimalNumber * 100) / 100).toFixed(2)
}

function Fila(i, cuota, interes, tasaSeguro, capital, saldo){
    this.mes = i + 1;
    this.cuota = formatNumber(cuota);
    this.interes = formatNumber(interes);
    this.tasaSeguro = formatNumber(tasaSeguro);
    this.capital = formatNumber(capital);
    this.saldo = formatNumber(saldo);
}

function getAcumuladorInteres(){
    let interesAcumulado = 0
    return function(interes = 0){
        interesAcumulado += interes
        return interesAcumulado;
    }
}

function sistemaFrances(tasaAnual, monto, periodoMeses, seguro, sumarInteres){
    const tasaMensual = tasaAnual / 12;
    const tasaSeguro = seguro / periodoMeses;
    const cuota = monto * (tasaMensual/(1 - Math.pow((1 + tasaMensual),-periodoMeses))) + tasaSeguro;
    let saldo = monto;
    let capital = 0;
    let interes = 0;
    let tabla = [];
    for(let i = 0; i < periodoMeses; i++){
        interes = (saldo * tasaAnual) / 12;
        sumarInteres(interes);
        capital = cuota - interes - tasaSeguro;
        saldo = saldo - capital;
        tabla.push(new Fila(i, cuota, interes, tasaSeguro, capital, saldo));
    }
    return tabla;
}

function sistemaAleman(tasaAnual, monto, periodoMeses, seguro, sumarInteres){
    const capital = monto / periodoMeses;
    const tasaSeguro = seguro / periodoMeses;
    let saldo = monto;
    let interes = 0;
    let cuota = 0;
    let tabla = [];
    for(let i = 0; i < periodoMeses; i++){
        interes = (saldo * tasaAnual) / 12;
        sumarInteres(interes);
        cuota = capital + interes + tasaSeguro;
        saldo = saldo - capital;
        tabla.push(new Fila(i, cuota, interes, tasaSeguro, capital, saldo));
    }
    return tabla;
}