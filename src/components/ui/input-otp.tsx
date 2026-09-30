"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<
  HTMLDivElement,
  {
    length?: number;
    containerClassName?: string;
    onComplete?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    name?: string;
  }
>(
  (
    {
      className,
      length = 6,
      containerClassName,
      onComplete,
      disabled,
      name,
      ...restProps
    },
    ref,
  ) => {
    const [values, setValues] = React.useState<string[]>(
      Array(length).fill(""),
    );
    const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 1) value = value[0];

      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);

      if (value && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      if (newValues.every((v) => v.length === 1)) {
        onComplete?.(newValues.join(""));
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !values[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      if (e.key === "ArrowLeft" && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);
      const newValues = pasted
        .split("")
        .concat(Array(length - pasted.length).fill(""));
      setValues(newValues);
      if (pasted.length === length) {
        inputsRef.current[length - 1]?.focus();
      } else {
        inputsRef.current[pasted.length]?.focus();
      }
      if (onComplete && pasted.length === length) {
        onComplete(pasted);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 has-[:disabled]:opacity-50",
          className,
        )}
        onPaste={handlePaste}
      >
        <div className={cn("flex items-center gap-2", containerClassName)}>
          {Array.from({ length }).map((_, i) => (
            <input
              key={`otp-${i}`}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={values[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={cn(
                "h-12 w-12 text-center border border-input bg-background rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-2xl font-mono",
                className,
              )}
              disabled={disabled}
              autoComplete="one-time-code"
              {...restProps}
            />
          ))}
        </div>
        <input type="hidden" name={name} value={values.join("")} />
      </div>
    );
  },
);

InputOTP.displayName = "InputOTP";

export { InputOTP };
