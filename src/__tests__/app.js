import App from "app";
import {render, screen, waitFor} from "@testing-library/react";
import {submitForm} from 'api';
import * as React from 'react'
import user from "@testing-library/user-event";

jest.mock('../api', () => ({
    submitForm: jest.fn(),
}));


const mockSubmitForm = () => {
    submitForm.mockResolvedValueOnce({message: "success"});

}
afterEach(() => {
    jest.clearAllMocks();
});

test('Cas passant', async () => {
        render(<App/>);
        expect(screen.getByRole('heading')).toHaveTextContent(/Welcome home/i);
        expect(screen.getByRole('link')).toHaveTextContent(/Fill out the form/i);
        let link = screen.getByText(/Fill out the form/i);
        user.click(link);

        expect(screen.getByRole('heading')).toHaveTextContent(/Page 1/i);
        let linkElements = screen.getAllByRole('link');
        expect(linkElements[0]).toHaveTextContent(/Go home/i);
        let foodLabel = screen.getByLabelText(/Favorite food/i);
        expect(foodLabel).toBeInTheDocument();
        user.type(foodLabel, "Les pâtes");
        linkElements = screen.getAllByRole('link');
        let next;
        expect(linkElements.some(link => {
            if (link.textContent === "Next") {
                next = link;
                return true;
            }
        })).toBeTruthy();
        user.click(next);
        expect(screen.getByRole('heading')).toHaveTextContent(/Page 2/i);
        linkElements = screen.getAllByRole('link');
        expect(linkElements.some(link => link.textContent === "Go Back")).toBeTruthy();
        let drinkLabel = screen.getByLabelText(/Favorite drink/i);
        expect(drinkLabel).toBeInTheDocument();
        user.type(drinkLabel, "Bière");
        linkElements = screen.getAllByRole('link');
        let review = linkElements.find(link => link.textContent === "Review");
        expect(review).toBeInTheDocument();
        user.click(review);
        expect(screen.getByRole('heading')).toHaveTextContent(/Confirm/i);
        expect(screen.getByText(/Please confirm your choices/i)).toBeInTheDocument();
        expect(screen.getByText(/favorite food/i)).toBeInTheDocument();
        expect(screen.getByText(/favorite drink/i)).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveTextContent(/Go back/i);
        let confirm = screen.getByRole('button');
        expect(confirm).toHaveTextContent(/Confirm/i);
        mockSubmitForm();
        user.click(confirm);
        await waitFor(() => expect(screen.getByRole('heading')).toHaveTextContent('Congrats. You did it.'));
        let goHome = screen.getByRole('link');
        expect(goHome).toHaveTextContent(/Go home/i);
        user.click(goHome);
        expect(screen.getByRole('heading')).toHaveTextContent(/Welcome home/i);
    }
);