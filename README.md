# Gale-Shapley Deferred Acceptance Algorithm
It is a Javascript implementation of the Gale-Shapley deferred acceptance algorithm featured in Gale and Shapley (1962). Web worker is used to divert the loading to an additional thread. 

The algorithm is implemented in the style of agent based models. "Men" and "women" to be matched in the "marriage market" are instances of **Man object** and **Woman object** which inherits from a base **Agent object**. The "market" and the main event loop belongs to an instance of **World object**, which is responsible for keeping the time of the world (in terms of steps), calling agents to act, checking the stop conditions after each step, and reporting. 

#Demo
A demo can be found [**here**](http://lab.thomassham.info/da_algo/). 

# Reference
Gale, D., & Shapley, L. S. (1962). College admissions and the stability of marriage. American Mathematical Monthly, 69, 9-15.
