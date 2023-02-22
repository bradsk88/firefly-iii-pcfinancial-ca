import {OpeningBalance} from "../../background/firefly_export";

export function getButtonDestination(): Element {
    return document.querySelector('div.notification-container')!;
}

export function isPageReadyForScraping(): boolean {
    // TODO: Some banks load accounts in slowly. Find a DOM element that is
    //  only present on the page once the accounts are fully loaded.
    return !!document.querySelector('span.account__details-number');
}

export function getAccountElements(): Element[] {
    return Array.from(
        document.querySelectorAll('credit-card account-summary')
            .values(),
    );
}

export function shouldSkipScrape(accountElement: Element): boolean {
    // TODO: If there are some types of accounts on the page that can't be
    //  scraped, return true for those here and they will be skipped.
    return false;
}

export function getAccountNumber(
    accountElement: Element,
): string {
    const nameDiv = accountElement.querySelector(
        'div.credit-account div.summary-col div.summary-labels',
    );
    return nameDiv!.textContent!.split('••••')[1].trim();
}

export function getAccountName(
    accountElement: Element,
): string {
    const number = getAccountNumber(accountElement);
    return `PC Mastercard: ${number}`;
}

export function getOpeningBalance(
    accountElement: Element,
): OpeningBalance | undefined {
    return undefined;
}