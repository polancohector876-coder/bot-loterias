{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 let active = 'jugada';\
let j = '';\
let m = '';\
let list = [];\
\
function presionarTecla(v) \{\
    if (v === 'del') \{\
        if (active === 'jugada') j = j.slice(0, -1);\
        else m = m.slice(0, -1);\
    \} else \{\
        if (active === 'jugada') j += v;\
        else m += v;\
    \}\
    \
    // Apuntamos directamente a los IDs reales del HTML para que aparezcan los n\'fameros\
    let elJugada = document.getElementById('vJugada');\
    let elMonto = document.getElementById('vMonto');\
    \
    if (elJugada) elJugada.innerText = j;\
    if (elMonto) elMonto.innerText = m;\
\}\
\
function seleccionarCampo(campo) \{\
    active = campo;\
    let bJugada = document.getElementById('boxJugada');\
    let bMonto = document.getElementById('boxMonto');\
    if (bJugada) bJugada.className = active === 'jugada' ? 'input-field active-input' : 'input-field';\
    if (bMonto) bMonto.className = active === 'monto' ? 'input-field active-input' : 'input-field';\
\}\
\
function agregarJugada() \{\
    let selectLoteria = document.getElementById('loteriaSelect');\
    if (!selectLoteria || !selectLoteria.value || selectLoteria.value.includes("CERRADAS")) \{\
        alert("\uc0\u55357 \u56594  Seleccione una loter\'eda v\'e1lida y abierta.");\
        return;\
    \}\
\
    let lotSelect = selectLoteria.value.split(' (')[0];\
\
    if (typeof validarCierreLoteria === 'function' && !validarCierreLoteria(lotSelect)) \{\
        return;\
    \}\
\
    if (j && m) \{\
        list.push(\{ j, m, lot: lotSelect \});\
        j = '';\
        m = '';\
        let elJugada = document.getElementById('vJugada');\
        let elMonto = document.getElementById('vMonto');\
        if (elJugada) elJugada.innerText = '';\
        if (elMonto) elMonto.innerText = '';\
        actualizarVistaLista();\
    \} else \{\
        alert("Debe ingresar la jugada y el monto.");\
    \}\
\}\
\
function actualizarVistaLista() \{\
    let container = document.getElementById('ticketList');\
    if (!container) return;\
    container.innerHTML = '';\
    list.forEach((item, index) => \{\
        container.innerHTML += `\
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed #ccc; padding:5px 0; font-size:13px;">\
                <span><b>$\{item.lot\}</b> | $\{item.j\} ($$\{item.m\})</span>\
                <div>\
                    $\{item.j.length === 2 ? `<button onclick="voltearJugada($\{index\})" style="background:#ff9800; color:white; border:none; padding:2px 6px; border-radius:3px; cursor:pointer; font-size:10px; margin-right:5px;">\uc0\u55357 \u56580  Voltear</button>` : ''\}\
                    <button onclick="eliminarItem($\{index\})" style="background:#e53935; color:white; border:none; padding:2px 6px; border-radius:3px; cursor:pointer; font-size:10px;">\uc0\u10005 </button>\
                </div>\
            </div>`;\
    \});\
\}\
\
function voltearJugada(index) \{\
    let original = list[index].j;\
    let volteado = original.split('').reverse().join('');\
    if (original !== volteado) \{\
        list.push(\{ j: volteado, m: list[index].m, lot: list[index].lot \});\
        actualizarVistaLista();\
    \} else \{\
        alert("Este n\'famero no se puede voltear.");\
    \}\
\}\
\
function eliminarItem(index) \{\
    list.splice(index, 1);\
    actualizarVistaLista();\
\}}