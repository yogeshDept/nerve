import { forwardRef } from 'react';

const Button = forwardRef(function Button(
  { className = '', type = 'button', ...props },
  ref
) {
  return <button ref={ref} type={type} className={className} {...props} />;
});

export default Button;
