import { useRef, useEffect } from "react";

export function usePrevious<T>(value: T): T {
    const ref = useRef<T>(); // Definiujemy ref jako T, co pozwala na użycie go do przechowania dowolnego typu, w tym string
    useEffect(() => {
      ref.current = value; // Przypisujemy bieżącą wartość do ref w każdym renderze
    }, [value]); // Efekt uruchamia się przy zmianie value
  
    return ref.current ?? value; // Zwracamy poprzednią wartość
  }