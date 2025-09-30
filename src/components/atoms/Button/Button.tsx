import React from 'react';
import { Button as HeroUIButton } from '@heroui/react';
import type { ButtonProps } from '../../../types/Button.types';

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  type = 'button',
  ariaLabel,
  children,
}) => {
  const color = variant === 'primary' ? 'primary' : 'secondary';

  return (
    <HeroUIButton
      color={color}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
    >
      {children}
    </HeroUIButton>
  );
};

export default Button;