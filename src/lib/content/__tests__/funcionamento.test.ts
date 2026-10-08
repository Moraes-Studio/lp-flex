import { describe, expect, it } from 'vitest';
import {
  agruparFuncionamento,
  calcularStatus,
  getFuncionamento,
  parseFuncionamento,
  type DiaFuncionamento,
} from '@/lib/content/funcionamento';

const grade: DiaFuncionamento[] = [
  { dia: 'Domingo e feriados', diaCurto: 'Dom', abre: '09:30', fecha: '12:30' },
  { dia: 'Segunda', diaCurto: 'Seg', abre: '05:00', fecha: '23:00' },
  { dia: 'Terça', diaCurto: 'Ter', abre: '05:00', fecha: '23:00' },
  { dia: 'Quarta', diaCurto: 'Qua', abre: '05:00', fecha: '23:00' },
  { dia: 'Quinta', diaCurto: 'Qui', abre: '05:00', fecha: '23:00' },
  { dia: 'Sexta', diaCurto: 'Sex', abre: '05:00', fecha: '22:00' },
  { dia: 'Sábado', diaCurto: 'Sáb', abre: '09:00', fecha: '15:00' },
];

describe('parseFuncionamento', () => {
  it('aceita uma lista válida de 7 dias', () => {
    expect(parseFuncionamento(grade)).toHaveLength(7);
  });

  it('rejeita lista com menos de 7 dias (JSON malformado)', () => {
    expect(() => parseFuncionamento(grade.slice(0, 3))).toThrow();
  });

  it('rejeita horário fora do formato HH:MM', () => {
    const invalido = [...grade];
    invalido[1] = { ...invalido[1], abre: '5h' };
    expect(() => parseFuncionamento(invalido)).toThrow();
  });

  it('aceita abre/fecha null pra dia fechado (edge case)', () => {
    const comFechado = [...grade];
    comFechado[0] = { ...comFechado[0], abre: null, fecha: null };
    expect(parseFuncionamento(comFechado)).toHaveLength(7);
  });
});

describe('getFuncionamento (arquivo real)', () => {
  it('content/funcionamento.json é válido', () => {
    expect(getFuncionamento()).toHaveLength(7);
  });
});

describe('calcularStatus', () => {
  // Instantes sempre como ISO com 'Z' (UTC explícito), nunca
  // `new Date(y, m, d, h, min)` (fuso local de quem roda o teste) — desde o
  // achado real de produção (grade "HOJE" errada por depender do fuso do
  // processo), `calcularStatus` interpreta `now` sempre em São Paulo
  // (`@/lib/timezone`), então o teste precisa fixar o instante sem
  // ambiguidade. 2026-08-17 é segunda em São Paulo; 10h/04h/23h30 abaixo já
  // são horário de São Paulo, convertidos pra UTC (+3h) na string.
  it('retorna aberto quando o horário atual está dentro da janela de segunda', () => {
    const segundaAsDezEmSP = new Date('2026-08-17T13:00:00Z'); // 10:00 em SP
    const status = calcularStatus(grade, segundaAsDezEmSP);
    expect(status).toEqual({ aberto: true, texto: 'Aberto agora · fecha às 23:00' });
  });

  it('retorna "abre hoje às" quando ainda não abriu', () => {
    const segundaCedoEmSP = new Date('2026-08-17T07:00:00Z'); // 04:00 em SP
    const status = calcularStatus(grade, segundaCedoEmSP);
    expect(status).toEqual({ aberto: false, texto: 'Abre hoje às 05:00' });
  });

  it('retorna "fechado, abre amanhã" quando já passou do fechamento', () => {
    // 23:30 de segunda em São Paulo = 02:30 de terça em UTC — instante que
    // já "virou o dia" em UTC mas continua segunda-feira em São Paulo;
    // prova que a virada de dia não vaza pro cálculo de horário de
    // funcionamento.
    const segundaTardeEmSP = new Date('2026-08-18T02:30:00Z');
    const status = calcularStatus(grade, segundaTardeEmSP);
    expect(status).toEqual({ aberto: false, texto: 'Fechado · abre amanhã' });
  });

  // Fim de semana: cada dia fecha num horário diferente do de segunda, e o
  // chip tem que usar o horário do próprio dia. 2026-08-21/22/23 são sexta,
  // sábado e domingo em São Paulo.
  it.each([
    ['sexta', '2026-08-21T23:00:00Z', 'Aberto agora · fecha às 22:00'], // 20:00 em SP
    ['sábado', '2026-08-22T15:00:00Z', 'Aberto agora · fecha às 15:00'], // 12:00 em SP
    ['domingo', '2026-08-23T13:00:00Z', 'Aberto agora · fecha às 12:30'], // 10:00 em SP
  ])('%s aberto mostra o fechamento do próprio dia', (_dia, iso, texto) => {
    expect(calcularStatus(grade, new Date(iso))).toEqual({ aberto: true, texto });
  });

  it.each([
    ['sexta depois das 22:00', '2026-08-22T01:30:00Z', 'Fechado · abre amanhã'], // 22:30 em SP
    ['sábado antes das 09:00', '2026-08-22T11:00:00Z', 'Abre hoje às 09:00'], // 08:00 em SP
    ['sábado depois das 15:00', '2026-08-22T18:30:00Z', 'Fechado · abre amanhã'], // 15:30 em SP
    ['domingo antes das 09:30', '2026-08-23T12:00:00Z', 'Abre hoje às 09:30'], // 09:00 em SP
    ['domingo depois das 12:30', '2026-08-23T15:31:00Z', 'Fechado · abre amanhã'], // 12:31 em SP
  ])('%s', (_caso, iso, texto) => {
    expect(calcularStatus(grade, new Date(iso))).toEqual({ aberto: false, texto });
  });

  it('retorna "fechado hoje" quando o dia não tem abre/fecha (edge case)', () => {
    const fechado = [...grade];
    fechado[1] = { ...fechado[1], abre: null, fecha: null };
    const segundaAsDezEmSP = new Date('2026-08-17T13:00:00Z');
    expect(calcularStatus(fechado, segundaAsDezEmSP)).toEqual({
      aberto: false,
      texto: 'Fechado hoje',
    });
  });
});

describe('agruparFuncionamento', () => {
  it('entrada vazia retorna lista vazia', () => {
    expect(agruparFuncionamento([])).toEqual([]);
  });

  it('junta dias consecutivos com o mesmo horário (grade real)', () => {
    expect(agruparFuncionamento(grade)).toEqual([
      { rotulo: 'Seg a Qui', rotuloLongo: 'Segunda a Quinta', horario: '05:00-23:00' },
      { rotulo: 'Sexta', rotuloLongo: 'Sexta', horario: '05:00-22:00' },
      { rotulo: 'Sábado', rotuloLongo: 'Sábado', horario: '09:00-15:00' },
      { rotulo: 'Domingo e feriados', rotuloLongo: 'Domingo e feriados', horario: '09:30-12:30' },
    ]);
  });

  it('dia fechado vira "Fechado" e não se junta a dia aberto', () => {
    const comFechado = grade.map((d) =>
      d.diaCurto === 'Dom' ? { ...d, abre: null, fecha: null } : d
    );
    expect(agruparFuncionamento(comFechado).at(-1)).toEqual({
      rotulo: 'Domingo e feriados',
      rotuloLongo: 'Domingo e feriados',
      horario: 'Fechado',
    });
  });

  it('semana inteira igual vira um grupo de Seg a Sáb mais o domingo separado', () => {
    const igual = grade.map((d) => ({ ...d, abre: '06:00', fecha: '22:00' }));
    expect(agruparFuncionamento(igual)).toEqual([
      { rotulo: 'Seg a Sáb', rotuloLongo: 'Segunda a Sábado', horario: '06:00-22:00' },
      { rotulo: 'Domingo e feriados', rotuloLongo: 'Domingo e feriados', horario: '06:00-22:00' },
    ]);
  });

  it('todos os dias diferentes geram 7 grupos com nome completo', () => {
    const diferentes = grade.map((d, i) => ({ ...d, abre: `0${i}:00`, fecha: '20:00' }));
    const grupos = agruparFuncionamento(diferentes);
    expect(grupos).toHaveLength(7);
    expect(grupos.map((g) => g.rotulo)).toEqual([
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
      'Domingo e feriados',
    ]);
  });

  it('rotuloLongo usa nomes completos do primeiro e do último dia', () => {
    const grupos = agruparFuncionamento(grade);
    expect(grupos.map((g) => g.rotuloLongo)).toEqual([
      'Segunda a Quinta',
      'Sexta',
      'Sábado',
      'Domingo e feriados',
    ]);
  });

  it('nunca usa travessão', () => {
    for (const g of agruparFuncionamento(grade)) {
      expect(`${g.rotulo} ${g.horario}`).not.toMatch(/[—–]/);
    }
  });
});
