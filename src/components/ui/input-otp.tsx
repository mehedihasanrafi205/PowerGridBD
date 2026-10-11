"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<
  HTMLDivElement,
  {
    length?: number;
    containerClassName?: string;
    inputClassName?: string;
    onComplete?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    name?: string;
    value?: string;
    onChange?: (value: string) => void;
  }
>(
  (
    {
      className,
      length = 6,
      containerClassName,
      inputClassName,
      onComplete,
      disabled,
      name,
      value,
      onChange,
      ...restProps
    },
    ref,
  ) => {
    const [values, setValues] = React.useState<string[]>(
      Array(length).fill(""),
    );
    const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

    // Sync with external value (for controlled usage)
    React.useEffect(() => {
      if (value !== undefined) {
        const newValues = value
          .split("")
          .concat(Array(length - value.length).fill(""))
          .slice(0, length);
        setValues(newValues);
      }
    }, [value, length]);

    const handleChange = (index: number, val: string) => {
      if (!/^\d*$/.test(val)) return;
      if (val.length > 1) val = val[0];

      const newValues = [...values];
      newValues[index] = val;
      setValues(newValues);

      const joined = newValues.join("");
      onChange?.(joined);
      onComplete?.(joined);

      if (val && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace") {
        if (values[index]) {
          // If current input has a value, clear it first
          e.preventDefault();
          const newValues = [...values];
          newValues[index] = "";
          setValues(newValues);
          onChange?.(newValues.join(""));
        } else if (index > 0) {
          // If current input is empty, move to previous
          inputsRef.current[index - 1]?.focus();
        }
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
      const joined = newValues.join("");
      onChange?.(joined);
      if (pasted.length === length) {
        inputsRef.current[length - 1]?.focus();
        onComplete?.(joined);
      } else {
        inputsRef.current[pasted.length]?.focus();
      }
    };

    const handleFocus = (index: number) => {
      // Select the text on focus for easy replacement
      inputsRef.current[index]?.select();
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 has-[:disabled]:opacity-50",
          className,
        )}
        onPaste={handlePaste}
        {...restProps}
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
              onFocus={(e) => handleFocus(i)}
              className={cn(
                "h-12 w-12 text-center border border-input bg-background rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-2xl font-mono",
                inputClassName,
              )}
              disabled={disabled}
              autoComplete="one-time-code"
            />
          ))}
        </div>
        <input
          type="hidden"
          name={name}
          value={values.join("")}
          readOnly
        />
      </div>
    );
  },
);

InputOTP.displayName = "InputOTP";

export { InputOTP };