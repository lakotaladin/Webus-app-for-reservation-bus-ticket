// import renderer from "react-test-renderer";
import { render } from "@testing-library/react";
import PageTitle from "../components/PageTitle";
import { BrowserRouter } from "react-router-dom";

//  Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
//  unmount and cleanup DOM after the test is finished.
// afterEach(cleanup);

// TEST 1 - Da proveri da li pise aladin
describe("Page title", () => {
  it("On submit user is loged", () => {
    const { getByTestId } = render(<PageTitle title={"aladin"} />);
    const title = getByTestId("pagetitle").textContent;
    expect(title).toEqual("aladin");
  });

  it("Treba da bude prazan string a ne null", () => {
    const { getByTestId } = render(<PageTitle title={null} />);
    const title = getByTestId("pagetitle").textContent;
    expect(title).toEqual("");
  });

  it("Treba da bude prazan string", () => {
    const { getByTestId } = render(<PageTitle />);
    const title = getByTestId("pagetitle").textContent;
    expect(title).toEqual("");
  });

  it("Treba da se desi greska ako posalje objekat umesto stringa", () => {
    const wrong = () => {
      render(<PageTitle title={{ title: "wrong" }} />);
    };
    expect(wrong).toThrow();
  });
});

// TEST 2 - Da proveri da li je null, treba da bude prazan string
