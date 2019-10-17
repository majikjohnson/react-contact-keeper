import '@testing-library/jest-dom/extend-expect';

const transitionMock = jest.mock('react-transition-group', () => {
	const FakeTransitionGroup = jest.fn(({children}) => children);
	const FakeCSSTransition = jest.fn(({children}) => children);

	return {
		CSSTransition: FakeCSSTransition,
		TransitionGroup: FakeTransitionGroup
	}
});