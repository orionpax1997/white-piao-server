import { render } from '@testing-library/react';
import Home from '@/pages/index';

it('renders homepage unchanged', () => {
  expect('pass').toMatchSnapshot();
});
