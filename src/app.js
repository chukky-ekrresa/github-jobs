import './styles/main.scss';

import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

let currentPage = 1;
const jobsLoader = document.getElementById('jobs-loader');
const jobsContainer = document.getElementById('jobs');
const scrollTrigger = document.getElementById('infinite-scroll-trigger');

async function fetchAndDisplayJobs(url, search) {
	try {
		const jobs = await fetchJobs(url);
		currentPage++;
		const jobsFragment = processJobs(jobs, { search });
		displayJobs(jobsFragment, search);
	} catch (error) {
		console.error(err.message);
	}
}

async function fetchJobs(url) {
	jobsLoader.classList.add('show');
	const response = await fetch(url);
	jobsLoader.classList.remove('show');

	return await response.json();
}

function processJobs(jobs, ...args) {
	const jobTemplate = document.getElementById('job-template');
	const jobsFragment = document.createDocumentFragment();

	jobs.forEach(job => {
		const clone = document.importNode(jobTemplate.content, true);

		const jobDate = clone.querySelector('#job-date');
		const jobType = clone.querySelector('#job-type');
		const jobLink = clone.querySelector('.job-url');

		const cardTitle = clone.querySelector('.card__title');
		const cardCompany = clone.querySelector('.card__company');
		const cardImage = clone.querySelector('.card__tag');
		const cardLocation = clone.querySelector('.card__location');

		cardTitle.textContent = job.title;
		cardCompany.textContent = job.company;
		cardImage.src = job.company_logo;
		cardLocation.textContent = job.location;
		jobType.textContent = job.type;
		jobDate.textContent = dayjs().to(dayjs(job.created_at));
		jobLink.href = '/job.html?job_id=' + job.id;

		jobsFragment.appendChild(clone);
	});

	return jobsFragment;
}

function displayJobs(jobsFragment, replace) {
	if (replace) {
		jobsContainer.replaceChild(jobsFragment);
	} else {
		jobsContainer.appendChild(jobsFragment);
	}
}

const searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', async function (evt) {
	evt.preventDefault();

	const url = new URL(
		'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?page=1'
	);

	const form = new FormData(this);

	for (const elem of form.keys()) {
		if (form.get(elem)) {
			if (elem === 'full_time') {
				url.searchParams.set('full_time', true);
			} else {
				url.searchParams.set(elem, form.get(elem));
			}
		}
	}

	await fetchAndDisplayJobs(url.href, true);
});

let observer = new IntersectionObserver(
	entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				fetchAndDisplayJobs(
					`https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?page=${currentPage}`,
					false
				);
			}
		});
	},
	{ threshold: 0.75 }
);

observer.observe(scrollTrigger);
