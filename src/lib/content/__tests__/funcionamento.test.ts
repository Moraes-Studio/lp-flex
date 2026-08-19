import { describe, expect, it } from 'vitest';
import {
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
  it('retorna aberto quando o horário atual está dentro da janela de segunda', () => {
    const segundaAsDez = new Date(2026, 7, 17, 10, 0); // 2026-08-17 é segunda
    const status = calcularStatus(grade, segundaAsDez);
    expect(status).toEqual({ aberto: true, texto: 'Aberto agora · fecha às 23:00' });
  });

  it('retorna "abre hoje às" quando ainda não abriu', () => {
    const segundaCedo = new Date(2026, 7, 17, 4, 0);
    const status = calcularStatus(grade, segundaCedo);
    expect(status).toEqual({ aberto: false, texto: 'Abre hoje às 05:00' });
  });

  it('retorna "fechado, abre amanhã" quando já passou do fechamento', () => {
    const segundaTarde = new Date(2026, 7, 17, 23, 30);
    const status = calcularStatus(grade, segundaTarde);
    expect(status).toEqual({ aberto: false, texto: 'Fechado · abre amanhã' });
  });

  it('retorna "fechado hoje" quando o dia não tem abre/fecha (edge case)', () => {
    const fechado = [...grade];
    fechado[1] = { ...fechado[1], abre: null, fecha: null };
    const segundaAsDez = new Date(2026, 7, 17, 10, 0);
    expect(calcularStatus(fechado, segundaAsDez)).toEqual({ aberto: false, texto: 'Fechado hoje' });
  });
});
