import { useEffect, useRef, useState } from "react"

enum Operator {
    add = '+',
    substract = '-',
    multiply = 'x',
    divide = '÷'
}

export const useCalculator = () => {

    const [formula, setFormula] = useState('')
    const [number, setNumber] = useState('0')
    const [prevNumber, setPrevNumber] = useState('0');

    const lastOperation = useRef<Operator>();

    useEffect(() => {
        if (lastOperation.current) {
            const firstFormularPart = formula.split(' ').at(0);
            setFormula(`${ firstFormularPart } ${ lastOperation.current } ${ number }`)
        } else {
            setFormula(number)
        }
    }, [number])

    useEffect(() => {
        const subResult = calculateSubResult();
        setPrevNumber(`${subResult}`)
    },[formula])

// El objetivo de esta funcion es armar el numero que vemos en la calculadora, con diferentes reglas para no armar un numero erroneo 
    const buildNumber = (numberString: string) => {
        if (number.includes('.') && numberString === '.') return;
        if (number.startsWith('0') || number.startsWith('-0')) {
            //poner punto decimal
            if (numberString === '.') {
                return setNumber(number + numberString);
            }
            //Evaluar si es otro cero y no hay punto
            if (numberString === '0' && number.includes('.')) {
                return setNumber(number + numberString);
            }

            if (numberString !== '0' && !number.includes('.')) {
                return setNumber(numberString)
            }
            //evaluar si es diferente de cero, no hay punto decimal

            //Evitar 0000000
            if (numberString === '0' && !number.includes('.')) {
                return;
            }
            return setNumber(number + numberString) 
        }
        setNumber(number + numberString)
    }

    const setLastNumber = () => {

        if (number.endsWith('.')) {
            setPrevNumber(number.slice(0, -1))
        } else {
            setPrevNumber(number)
        }
        setNumber('0')
    }

    const divideOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.divide
    }

    const multiplyOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.multiply
    }

    const subsctractOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.substract
    }

    const addOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.add
    }


    const calculateResult = () => {
        const result  = calculateSubResult()
        setFormula(`${result}`)
        lastOperation.current = undefined
        setPrevNumber('0')
    }
    const calculateSubResult = ():number  => {
        const [firstValue, operation, secondValue] = formula.split(' ')
        const num1 = Number(firstValue)
        const num2 = Number(secondValue)

        if(isNaN(num2)) return num1

        switch (operation) {

            case Operator.add:
                return num1 + num2

            case Operator.substract:
                return num1 - num2

            case Operator.multiply:
                return num1 * num2

            case Operator.divide:
                return num1 / num2

            default:
                throw new Error('Operation not implemented');
        }
    }


    const clean = () => {
        setNumber('0')
        setPrevNumber('0')
        lastOperation.current = undefined;
        setFormula('')
    }

    const deleteOperation = () => {
        if (number.length === 1 && !number.includes('-')) {
            return setNumber('0')
        }
        if (number.length === 2 && number.includes('-')) {
            return setNumber('0')
        }
        setNumber(number.slice(0, -1))


    }

    const toggleSign = () => {
        if (number.includes('-')) {
            return setNumber(number.replace('-', ''))
        }

        setNumber('-' + number)
    }

    return {
        //properties
        number,
        prevNumber,
        formula,
        //methods
        buildNumber, toggleSign, clean, deleteOperation, addOperation, multiplyOperation, subsctractOperation, divideOperation, calculateResult
    }

}