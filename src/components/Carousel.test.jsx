import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Carousel from './Carousel';
import { BrowserRouter } from 'react-router-dom';

const slides = [
  { id: 1, title: 'Slide 1', image: 'image1.jpg' },
  { id: 2, title: 'Slide 2', image: 'image2.jpg' },
  { id: 3, title: 'Slide 3', image: 'image3.jpg' },
  { id: 4, title: 'Slide 4', image: 'image4.jpg' },
  { id: 5, title: 'Slide 5', image: 'image5.jpg' },
];

function setWindowWidth(width) {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
}

describe('Carousel Component', () => {
  beforeEach(() => {
    setWindowWidth(1024);
  });

  test('renders Carousel component', () => {
    render(
      <BrowserRouter>
        <Carousel slides={slides} />
      </BrowserRouter>
    );

    expect(screen.getByAltText('Slide 1')).toBeInTheDocument();
  });

  test('navigates slides on next button click', () => {
    render(
      <BrowserRouter>
        <Carousel slides={slides} />
      </BrowserRouter>
    );

    const nextButton = screen.getByLabelText('Próximo Slide');
    fireEvent.click(nextButton);

    expect(screen.getByAltText('Slide 2')).toBeInTheDocument();
  });

  test('navigates slides on previous button click', () => {
    render(
      <BrowserRouter>
        <Carousel slides={slides} />
      </BrowserRouter>
    );

    const prevButton = screen.getByLabelText('Slide Anterior');
    fireEvent.click(prevButton);

    expect(screen.getByAltText('Slide 5')).toBeInTheDocument();
  });

  test('cycles back to first slide after last slide', () => {
    render(
      <BrowserRouter>
        <Carousel slides={slides} />
      </BrowserRouter>
    );

    const nextButton = screen.getByLabelText('Próximo Slide');

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument();
  });

  test('cycles back to last slide when clicking previous from first slide', () => {
    render(
      <BrowserRouter>
        <Carousel slides={slides} />
      </BrowserRouter>
    );

    const prevButton = screen.getByLabelText('Slide Anterior');
    fireEvent.click(prevButton);

    expect(screen.getByAltText('Slide 5')).toBeInTheDocument();
  });
});
