#include <bits/stdc++.h>

using namespace std;

int main()
{ int n,k,i,j,x;
	cin>>n>>k;
	int a[n];
	map<int ,int >m;
	map<int ,int >in;
	for(i=0;i<n;i++)
	{   cin>>a[i];
		m[a[i]]++;
		auto it= in.find(a[i]);

		if(it==in.end())
			in.insert({ a[i] ,i});
    }

    map<int,set<int >> mp;
    for( auto pr:m)
    {  int a=pr.first;
    	int b=pr.second;
    	mp[b].insert(a);

    }
    
    
   
    
     auto it=(--mp.end());
    while(1)
    {   auto a=(*it).first;
        auto b=(*it).second;
        map<int ,int >lst;
        for(auto val: b)
     	{  lst.insert( { in[val],val } ); 
    	    
     	}
     	
     	for( auto pr:lst)
     	{    
     	    for(i=0;i<a;i++)
     	    cout<<pr.second<<" ";
     	    
     	}
        
        if(it==mp.begin())
         break;
         it--;
        
        
    }
    
    
    
}









// giving error  =>  
// jdoodle.cpp: In function ‘int display(int*, int, int)’:
// jdoodle.cpp:18:1: warning: control reaches end of non-void function [-Wreturn-type]
//    18 | }
//       | ^



//   code=>
// #include <iostream>

// using namespace std;
// int display(int a[] ,int n,int val)
// {    if(n== 0)
//      {    if(a[n]==val)
//        return n;
//        else
//        return -1;
         
//      }
    
//     if(a[n]==val)
//        return n;
      
//        display(a,n-1,val);
    
// }

// int main()
// { int n,i,j,val;
//   cin>>n>>val;
//   int a[n];
//     for(i=0;i<n;i++)
//      cin>>a[i];
//    i=0;
  
//      cout<<display(a,n-1,val);
    
// }