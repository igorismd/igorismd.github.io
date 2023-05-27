import Post from '../domain/Post';

class PostFetcher {
  private readonly url = 'https://speed.taxipark.tech/wp-json/wp/v2/';

  getById = async (postId: string): Promise<Post> => {
    const response = await fetch(`${this.url}posts/${postId}`);
    const data = await response.json();
    const mediaResponse = await fetch(`${this.url}media/${data.featured_media}`);
    const mediaData = await mediaResponse.json();

    return new Post(
      data.id,
      data.title.rendered,
      data.content.rendered,
      mediaData.source_url,
      PostFetcher.dateToString(new Date(data.date)),
    );
  };

  getLastPosts = async () => {
    const postsList: Post[] = [];
    const response = await fetch(`${this.url}posts`);
    const data = await response.json();
    
    for (let i = 0; i < data.length; i++) {
      const mediaResponse = await fetch(`${this.url}media/${data[i].featured_media}`);
      const mediaData = await mediaResponse.json();

      postsList.push(
        new Post(
          data[i].id,
          data[i].title.rendered,
          data[i].content.rendered,
          mediaData.source_url,
          PostFetcher.dateToString(new Date(data[i].date)),
          data[i].excerpt.rendered,
        )
      );
    }
    
    data.forEach(() => {});

    return postsList;
  };

  private static dateToString = (date: Date) => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };
}

export default PostFetcher;
