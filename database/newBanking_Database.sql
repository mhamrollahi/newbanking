USE [NewBanking]
GO
/****** Object:  Table [dbo].[CodeTableList]    Script Date: 19/06/1403 11:30:32 ب.ظ ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CodeTableList](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [int] NOT NULL,
	[en_TableName] [nvarchar](50) NOT NULL,
	[fa_TableName] [nvarchar](50) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[update_at] [datetime] NULL,
	[creator] [nvarchar](50) NOT NULL,
	[updater] [nvarchar](50) NULL,
 CONSTRAINT [PK_en_fa_TableName] PRIMARY KEY CLUSTERED 
(
	[en_TableName] ASC,
	[fa_TableName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CodingData]    Script Date: 19/06/1403 11:30:32 ب.ظ ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CodingData](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codeTableListId] [int] NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[description] [nvarchar](255) NULL,
	[sortId] [int] NOT NULL,
	[refId] [nchar](10) NULL,
	[create_at] [datetime] NOT NULL,
	[update_at] [datetime] NULL,
	[creator] [nvarchar](50) NOT NULL,
	[updater] [nvarchar](50) NULL,
 CONSTRAINT [PK_codeTableListID_Title] PRIMARY KEY CLUSTERED 
(
	[codeTableListId] ASC,
	[title] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[CodeTableList] ADD  CONSTRAINT [DF_CodingTables_created_at]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[CodingData] ADD  CONSTRAINT [DF_CodingData_create_at]  DEFAULT (getdate()) FOR [create_at]
GO
