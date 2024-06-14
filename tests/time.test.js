import { detectDate } from "../scripts/timestructures"
import { expect, test } from "vitest"

test('date in title: M/D/YY', () => {
    const block = {title: '1/1/24'}
    expect(detectDate(block)).toBe('1-1')
})

test('date in title: M/D/YYYY', () => {
    const block = {title: '1/2/2024'}
    expect(detectDate(block)).toBe('1-2')
})

test('date in title: MM/DD/YY', () => {
    const block = {title: '02/11/24'}
    expect(detectDate(block)).toBe('2-11')
})

test('date in title: YYYY-MM-DD', () => {
    const block = {title: '2023-11-11'}
    expect(detectDate(block)).toBe('11-11')
})

test('date in title: YYYYMMDD', () => {
    const block = {title: '20221111'}
    expect(detectDate(block)).toBe('11-11')
})

test('date in text: DD mmmmm, YYYY', () => {
    const block = {title: undefined, content: 'Friend #019 23 May, 2024 Jennifer'}
    expect(detectDate(block)).toBe('5-23')
})

test('date in text: mmmmm DDth, YYYY', () => {
    const block = {title: undefined, content: 'Friend #018 April 30, 2024 Bruno'}
    expect(detectDate(block)).toBe('4-30')
})