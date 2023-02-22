import {AccountRead} from "firefly-iii-typescript-sdk-fetch/dist/models/AccountRead";
import {getAccountNumber} from "./accounts";
import {parseDate} from "../../common/dates";
import {priceFromString} from "../../common/prices";

export function getButtonDestination(): Element {
    return document.querySelector(
        'transaction-credit div.cta-container div.right'
    )!;
}

/**
 * @param accounts The first page of account in your Firefly III instance
 */
export async function getCurrentPageAccount(
    accounts: AccountRead[],
): Promise<AccountRead> {
    const div = document.querySelector(
        'div#main-content div.selector-container accounts-side-nav'
    )!;
    const number = getAccountNumber(div)
    return accounts.find(a => a.attributes.accountNumber === number)!;
}

export function isPageReadyForScraping(): boolean {
    return true;
}

export function getRowElements(): Element[] {
    if (!document.querySelector("div.table-container table")) {
        throw new Error("Page is not ready for scraping")
    }

    return Array.from(document.querySelectorAll(
        'div.table-container table tbody tr',
    ).values());
}

export function getRowDate(el: Element): Date {
    const date = el.querySelector('td.date span:nth-child(1)');
    // TODO: Scrape exact time
    // const time = el.querySelector('td.date span:nth-child(2)');
    return parseDate(date!.textContent!);
}

function isRowLoading(r: Element): boolean {
    const posAmount = r.querySelector(".amount.positive");
    const negAmount = r.querySelector(".amount.negative")
    return !posAmount && !negAmount;
}

export function getRowAmount(r: Element, pageAccount: AccountRead): number {
    if (isRowLoading(r)) {
        throw new Error("Page is not ready for scraping")
    }
    const posAmount = r.querySelector(".amount.positive");
    const negAmount = r.querySelector(".amount.negative")
    if (posAmount) {
        return priceFromString(posAmount!.textContent!);
    }
    return -priceFromString(negAmount!.textContent!);
}

export function getRowDesc(r: Element): string {
    return r.querySelector(
        'td.description span.description-text',
    )!.textContent!
}

export function findBackToAccountsPageButton(): HTMLElement {
    // TODO: Once a single account's transactions have been scraped, we need to
    //  go back to the main accounts page to finish the auto run. Find an
    //  element on the page that we can click on to go back. Example below.
    return document.querySelector('button.btn-icon-back')!;
}