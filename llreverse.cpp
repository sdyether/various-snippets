#include <stdio.h>

typedef struct Node {
	char data;
	struct Node* next;
} Node;

void print_list(Node* head) {
	while(head) {
		printf("%c ", head->data);
		head = head->next;
	}
	printf("\n");
}

Node* reverse_list(Node* head) {
	//challenge: reverse a list with only two pointers
	Node* revhead = 0; // B-)
	Node* tmp = 0;
	
	while (head) {
		tmp = head;
		head = head->next;
		tmp->next = revhead;
		revhead = tmp;
	}
	
	return revhead;
}

int main() {
	Node d = {'d', NULL};
	Node c = {'c', &d};
	Node b = {'b', &c};
	Node a = {'a', &b};
	
	Node* head = &a;
	print_list(head);
	head = reverse_list(head);
	print_list(head);
	
	return 0;
}