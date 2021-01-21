import './styles/main.scss';

import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

async function fetchJobs() {
	const response = await fetch(
		'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json'
	);

	const jobs = await response.json();
	return jobs;
}

fetchJobs()
	.then(jobs => {
		const jobsContainer = document.getElementById('jobs');
		const jobsFragment = document.createDocumentFragment();

		jobs.forEach(job => {
			const jobTemplate = document.createElement('template');
			const jobHtmlString = `<div class="card">
					<div class="card__tag"></div>
					<div class="card__date">
						<span>${dayjs().to(dayjs(job.created_at))}</span>
						<span>&#183;</span>
						<span>${job.type}</span>
					</div>
					<h2 class="card__title">
						${job.title}
					</h2>
					<div class="card__company">${job.company}</div>
					<div class="card__location">${job.location}</div>
				</div>`;

			jobTemplate.innerHTML = jobHtmlString;
			jobsFragment.appendChild(jobTemplate.content.firstChild);
		});

		jobsContainer.appendChild(jobsFragment);
	})
	.catch(err => {
		console.log(err.message);
	});
